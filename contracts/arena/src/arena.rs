use crate::battle::Battle;
use crate::character::Character;
use crate::item::ItemStorage;
use arena_io::{ArenaAction, ArenaEvent, ArenaState, BattleLog, SetTier};
use gstd::collections::BTreeMap;
use gstd::{debug, exec, msg, prelude::*, ActorId, ReservationId};
use mint_io::{CharacterInfo, IdPair, MintAction};

const GAS_FOR_BATTLE: u64 = 245_000_000_000;
const LOBBY_CAPACITY: [Capacity; 2] = [
    Capacity {
        size: 2,
        reservations: 0,
    },
    Capacity {
        size: 4,
        reservations: 2,
    },
];

#[derive(Clone, Default)]
struct Capacity {
    size: u8,
    reservations: u8,
}

#[derive(Default)]
pub struct Lobby {
    id: u128,
    current_tier: SetTier,
    characters: Vec<Character>,
    source: Option<ActorId>, // original play sender
    capacity: Capacity,
    reservations: Vec<ReservationId>,
    battles: Vec<Battle>,
    winners: Vec<u128>,
    losers: Vec<IdPair>,
    logs: Vec<BattleLog>,
    started: bool,
}

pub struct Arena {
    mint: ActorId,
    lobby_count: u128,
    lobbys: BTreeMap<u128, Lobby>,
    item_storage: ItemStorage,
}

impl Arena {
    pub fn new(mint: ActorId, item_storage: ItemStorage) -> Arena {
        Arena {
            mint,
            item_storage,
            lobby_count: 0,
            lobbys: BTreeMap::new(),
        }
    }

    pub fn create_lobby(&mut self, capacity: u8) {
        let capacity = LOBBY_CAPACITY
            .iter()
            .find(|c| c.size == capacity)
            .expect("lobby capacity out of range");

        let lobby_id = self.lobby_count;
        let lobby = Lobby {
            id: lobby_id,
            capacity: capacity.clone(),
            ..Default::default()
        };
        self.lobbys.insert(lobby.id, lobby);
        self.lobby_count += 1;

        msg::reply(
            ArenaEvent::LobbyCreated {
                lobby_id,
                capacity: capacity.size,
            },
            0,
        )
        .expect("unable to reply");
    }

    pub async fn play(&mut self, lobby_id: u128) {
        let lobby = self.lobbys.get_mut(&lobby_id).expect("lobby isn't found");

        if lobby.characters.len() != lobby.capacity.size.into() {
            panic!("not enough players to start the battle");
        }

        if lobby.started && msg::source() != exec::program_id() {
            panic!("the battle is already started");
        }

        if lobby.battles.is_empty() {
            debug!("starting the battle");
            lobby.started = true;
            lobby.source = Some(msg::source());
            lobby.battles = lobby
                .characters
                .chunks_exact(2)
                .map(|characters| Battle::new(characters[0].clone(), characters[1].clone()))
                .collect();

            msg::send(msg::source(), ArenaEvent::BattleStarted { lobby_id }, 0)
                .expect("unable to send");
        }
        let source = lobby.source.expect("original sender is not specified");
        let battle = lobby.battles.pop().unwrap();
        let log = battle.fight().await;

        debug!("LOG {:?}", log);
        if log.character1.1 {
            let loser = lobby
                .characters
                .iter()
                .find(|c| c.id == log.character2.0)
                .unwrap();
            lobby.winners.push(log.character1.0);
            lobby.losers.push(IdPair {
                owner_id: loser.owner,
                character_id: loser.id,
            });
        } else {
            let loser = lobby
                .characters
                .iter()
                .find(|c| c.id == log.character1.0)
                .unwrap();
            lobby.winners.push(log.character2.0);
            lobby.losers.push(IdPair {
                owner_id: loser.owner,
                character_id: loser.id,
            });
        }
        lobby.logs.push(log);

        if lobby.battles.is_empty() {
            if lobby.winners.len() == 1 {
                let winner = lobby
                    .characters
                    .iter()
                    .find(|c| c.id == lobby.winners[0])
                    .unwrap();
                debug!("{:?} is an arena winner", winner.owner);

                msg::send(
                    self.mint,
                    MintAction::BattleResult {
                        winner: IdPair {
                            owner_id: winner.owner,
                            character_id: winner.id,
                        },
                        losers: lobby.losers.drain(..).collect(),
                        reply_to: source,
                    },
                    0,
                )
                .expect("unable to reply");

                msg::send(
                    source,
                    ArenaEvent::LobbyBattleLog {
                        lobby_id,
                        winner_id: winner.id,
                        logs: lobby.logs.drain(..).collect(),
                    },
                    0,
                )
                .expect("unable to reply");

                self.lobbys.remove(&lobby_id);
                return;
            } else {
                lobby.battles = lobby
                    .winners
                    .chunks_exact(2)
                    .map(|characters| {
                        Battle::new(
                            lobby
                                .characters
                                .iter()
                                .find(|c| c.id == characters[0])
                                .unwrap()
                                .clone(),
                            lobby
                                .characters
                                .iter()
                                .find(|c| c.id == characters[1])
                                .unwrap()
                                .clone(),
                        )
                    })
                    .collect();
                lobby.winners = vec![];
            }
        }

        if let Some(id) = lobby.reservations.pop() {
            msg::send_from_reservation(id, exec::program_id(), ArenaAction::Play { lobby_id }, 0)
                .expect("unable to send");
        } else {
            panic!("more gas is required");
        }
    }

    pub async fn register(&mut self, lobby_id: u128, owner_id: ActorId) {
        let payload = MintAction::CharacterInfo { owner_id };
        let character_info: CharacterInfo = msg::send_for_reply_as(self.mint, payload, 0, 0)
            .expect("unable to send message")
            .await
            .expect("unable to receive reply");

        let character = self.create_character(character_info, owner_id);

        let lobby = self.lobbys.get_mut(&lobby_id).expect("lobby isn't found");

        if lobby.characters.len() == lobby.capacity.size.into() {
            panic!("max number of players is already registered");
        }

        // Check whether player already registered
        if lobby.characters.iter().any(|c| c.owner == owner_id) {
            panic!("already registered");
        }

        debug!("Current tier is {:#?}", lobby.current_tier);
        // Identify character tier based on level
        let character_tier: SetTier = match character.level {
            0 => unreachable!(),
            1 => SetTier::Tier5,
            2 => SetTier::Tier4,
            3..=5 => SetTier::Tier3,
            6..=9 => SetTier::Tier2,
            _ => SetTier::Tier1,
        };
        debug!("Character tier is {:#?}", character_tier);
        // set current tournament tier based on the first registered character's level
        // Initialize current_tier based on the level of the first registered character
        if let SetTier::Tier0 = lobby.current_tier {
            lobby.current_tier = character_tier.clone();
        }

        if character_tier == lobby.current_tier {
            // add if can't register send the error message ("Wrong Tier") && test it
            msg::reply(
                ArenaEvent::PlayerRegistered {
                    lobby_id,
                    player_id: character.id,
                    tier: character_tier as u8,
                },
                0,
            )
            .expect("unable to reply");
            lobby.characters.push(character);
        } else {
            panic!("Can't Register for this Tier");
        };

        debug!("Current tier after registration {:#?}", lobby.current_tier);
        debug!("Registered participants{:?}", lobby.characters);
    }

    pub fn reserve_gas(&mut self, lobby_id: u128) {
        let lobby = self.lobbys.get_mut(&lobby_id).expect("lobby isn't found");

        if lobby.reservations.len() == lobby.capacity.reservations.into() {
            panic!("lobby need no more reservations");
        }

        let reservation_id =
            ReservationId::reserve(GAS_FOR_BATTLE, 864000).expect("unable to reserve");
        lobby.reservations.push(reservation_id);
        msg::reply(ArenaEvent::GasReserved { lobby_id }, 0).expect("unable to reply");
    }

    pub fn state(&self) -> ArenaState {
        ArenaState {
            mint: self.mint,
            lobby_count: self.lobby_count,
        }
    }

    fn create_character(&self, character_info: CharacterInfo, owner_id: ActorId) -> Character {
        let items = self.item_storage.get_items(&character_info.items);
        let character = Character::new(character_info, owner_id, items);
        character
    }
}
