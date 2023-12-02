use crate::battle::Battle;
use crate::execute::ENERGY;
use arena_io::{ArenaState, BattleLog, BattleState, Character, GameAction, GameEvent, SetTier};
use gstd::{debug, exec, msg, prelude::*, ActorId, ReservationId};
use mint_io::{CharacterInfo, MintAction};

const HP_MULTIPLIER: u8 = 10;
const BASE_HP: u8 = 90;
const GAS_FOR_BATTLE: u64 = 245_000_000_000;
const NUMBER_OF_PLAYERS: usize = 4;

#[derive(Default)]
pub struct Arena {
    current_tier: SetTier,
    characters: Vec<Character>,
    mint: ActorId,
    battles: Vec<Battle>,
    winners: Vec<ActorId>,
    reservations: Vec<ReservationId>,
    source: Option<ActorId>, // original play sender
    logs: Vec<BattleLog>,
    leaderboard: BTreeMap<ActorId, u32>,
}

impl Arena {
    pub fn new(mint: ActorId) -> Arena {
        Arena {
            mint,
            ..Default::default()
        }
    }

    pub async fn play(&mut self) {
        if self.battles.is_empty() {
            debug!("starting the battle");
            self.source = Some(msg::source());
            self.battles = self
                .characters
                .chunks_exact(2)
                .map(|characters| Battle::new(characters[0].clone(), characters[1].clone()))
                .collect();
        }
        let source = self.source.expect("original sender is not specified");

        let battle = self.battles.pop().unwrap();
        let log = battle.fight().await;
        self.winners.push(log.winner);
        self.logs.push(log);

        if self.battles.is_empty() {
            if self.winners.len() == 1 {
                let winner = self
                    .characters
                    .iter()
                    .find(|c| c.id == self.winners[0])
                    .unwrap();
                debug!("{:?} is an arena winner", winner.owner);

                msg::send(
                    self.mint,
                    MintAction::BattleResult {
                        owner_id: winner.owner,
                    },
                    0,
                )
                .expect("unable to reply");

                msg::send(
                    source,
                    GameEvent::ArenaLog {
                        winner: winner.id,
                        logs: self.logs.drain(..).collect(),
                    },
                    0,
                )
                .expect("unable to reply");

                self.tournament_winners(winner.owner);
                self.clean_state();
                return;
            } else {
                self.battles = self
                    .winners
                    .chunks_exact(2)
                    .map(|characters| {
                        Battle::new(
                            self.characters
                                .iter()
                                .find(|c| c.id == characters[0])
                                .unwrap()
                                .clone(),
                            self.characters
                                .iter()
                                .find(|c| c.id == characters[1])
                                .unwrap()
                                .clone(),
                        )
                    })
                    .collect();
                self.winners = vec![];
            }
        }

        if let Some(id) = self.reservations.pop() {
            msg::send_from_reservation(id, exec::program_id(), GameAction::Play, 0)
                .expect("unable to send");
        } else {
            panic!("more gas is required");
        }
    }

    pub async fn register(&mut self, owner_id: ActorId) {
        if self.characters.len() == NUMBER_OF_PLAYERS {
            panic!("max number of players is already registered");
        }
        let payload = MintAction::CharacterInfo { owner_id };
        let character_info: CharacterInfo = msg::send_for_reply_as(self.mint, payload, 0, 0)
            .expect("unable to send message")
            .await
            .expect("unable to receive reply");

        let character = Character {
            owner: owner_id,
            id: character_info.id,
            name: character_info.name,
            hp: character_info.attributes.vitality * HP_MULTIPLIER + BASE_HP,
            energy: ENERGY[usize::from(character_info.attributes.stamina)],
            position: 0,
            attributes: character_info.attributes,
            lower_hit_chance: false,
            parry: false,
            energy_reg_counter: 0,
            initiative_incr: 0,
        };

        // Check whether player already registered
        if self.characters.iter().any(|c| c.owner == owner_id) {
            panic!("already registered");
        }

        debug!("Current tier is {:#?}", self.current_tier);
        // Identify character tier based on level
        let character_tier: SetTier = match character.attributes.level {
            0 => SetTier::Tier5,
            1 => SetTier::Tier4,
            2..=4 => SetTier::Tier3,
            5..=8 => SetTier::Tier2,
            _ => SetTier::Tier1,
        };
        debug!("Character tier is {:#?}", character_tier);
        // set current tournament tier based on the first registered character's level
        // Initialize current_tier based on the level of the first registered character
        if let SetTier::Tier0 = self.current_tier {
            self.current_tier = match character.attributes.level {
                0 => SetTier::Tier5,
                1 => SetTier::Tier4,
                2..=4 => SetTier::Tier3,
                5..=8 => SetTier::Tier2,
                _ => SetTier::Tier1,
            }
        };
        if character_tier == self.current_tier {
            self.characters.push(character);
            // add if can't register send the error message ("Wrong Tier") && test it
        } else {
            panic!("Can't Register for this Tier");
        };

        debug!("Current tier after registration {:#?}", self.current_tier);
        debug!("Registered participants{:?}", self.characters);

        msg::reply(
            GameEvent::RegisteredPlayers(
                self.characters
                    .iter()
                    .map(|character| CharacterInfo {
                        id: character.id,
                        name: character.name.clone(),
                        attributes: character.attributes.clone(),
                    })
                    .collect(),
            ),
            0,
        )
        .expect("unable to reply");
    }

    pub fn reserve_gas(&mut self) {
        let reservation_id =
            ReservationId::reserve(GAS_FOR_BATTLE, 500).expect("unable to reserve");
        self.reservations.push(reservation_id);
        msg::reply(GameEvent::GasReserved, 0).expect("unable to reply");
    }

    pub fn clean_state(&mut self) {
        self.current_tier = SetTier::Tier0;
        self.winners = vec![];
        self.characters = vec![];
        self.reservations = vec![];
        self.battles = vec![];
        self.logs = vec![];
        self.source = None;
    }

    pub fn tournament_winners(&mut self, winner: ActorId) {
        self.leaderboard
            .entry(winner)
            .and_modify(|value| *value += 1)
            .or_insert(1);
    }

    pub fn state(&self) -> ArenaState {
        ArenaState {
            current_tier: self.current_tier.clone(),
            mint: self.mint,
            characters: self.characters.clone(),
            reservations: self.reservations.clone(),
            winners: self.winners.clone(),
            battles: self
                .battles
                .iter()
                .map(|battle| BattleState {
                    c1: battle.c1.clone(),
                    c2: battle.c2.clone(),
                })
                .collect(),
            leaderboard: self.leaderboard.clone(),
        }
    }
}
