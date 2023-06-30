#![no_std]

use arena_io::{ArenaState, BattleState, Character, GameAction, GameEvent};
use battle::{Battle, ENERGY};
use gstd::{debug, exec, msg, prelude::*, ActorId, ReservationId};
use mint_io::{CharacterInfo, MintAction};

mod battle;

const HP_MULTIPLIER: u8 = 30;
const BASE_HP: u8 = 10;
const GAS_FOR_BATTLE: u64 = 200_000_000_000;
const NUMBER_OF_PLAYERS: usize = 4;

#[derive(Default)]
struct Arena {
    characters: Vec<Character>,
    mint: ActorId,
    battles: Vec<Battle>,
    winners: Vec<ActorId>,
    reservations: Vec<ReservationId>,
    source: Option<ActorId>, // original play sender
    leaderboard: BTreeMap<ActorId, u32>,
}

impl Arena {
    async fn play(&mut self) {
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
        let winner = battle.fight(source).await;
        self.winners.push(winner.id);

        if self.battles.is_empty() {
            if self.winners.len() == 1 {
                self.clean_state();
                debug!("{:?} is an arena winner", winner.id);
                msg::send(source, GameEvent::PlayerWon(winner.id), 0).expect("unable to reply");
                self.tournament_winners(winner.id);
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
            msg::send(source, GameEvent::NextBattleFromReservation, 0).expect("unable to reply");
        } else {
            panic!("more gas is required");
        }
    }

    async fn register(&mut self, owner_id: ActorId) {
        if self.characters.len() == NUMBER_OF_PLAYERS {
            panic!("max number of players is already registered");
        }

        let payload = MintAction::CharacterInfo { owner_id };
        let character_info: CharacterInfo = msg::send_for_reply_as(self.mint, payload, 0)
            .expect("unable to send message")
            .await
            .expect("unable to receive reply");

        let character = Character {
            id: character_info.id,
            name: character_info.name,
            hp: character_info.attributes.vitality * HP_MULTIPLIER + BASE_HP,
            energy: ENERGY[usize::from(character_info.attributes.stamina)],
            position: 0,
            attributes: character_info.attributes,
        };

        debug!("character {:?} registered on the arena", character.id);
        self.characters.push(character);

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

    fn reserve_gas(&mut self) {
        let reservation_id =
            ReservationId::reserve(GAS_FOR_BATTLE, 500).expect("unable to reserve");
        self.reservations.push(reservation_id);
        msg::reply(GameEvent::GasReserved, 0).expect("unable to reply");
    }

    fn clean_state(&mut self) {
        self.winners = vec![];
        self.characters = vec![];
        self.reservations = vec![];
        self.battles = vec![];
        self.source = None;
    }

    fn tournament_winners(&mut self, winner: ActorId) {
        if self.leaderboard.contains_key(&winner) {
            if let Some(value) = self.leaderboard.get_mut(&winner) {
                *value += 1;
            }
        } else {
            self.leaderboard.insert(winner, 0);
            if let Some(value) = self.leaderboard.get_mut(&winner) {
                *value += 1;
            }
        }
    }
}

static mut ARENA: Option<Arena> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    let mint: ActorId = msg::load().expect("unable to decode `ActorId`");
    ARENA = Some(Arena {
        mint,
        ..Default::default()
    });
}

#[gstd::async_main]
async fn main() {
    let arena = unsafe { ARENA.as_mut().unwrap() };
    let action: GameAction = msg::load().expect("unable to decode `GameAction`");
    match action {
        GameAction::Register { owner_id } => {
            arena.register(owner_id).await;
        }
        GameAction::Play => arena.play().await,
        GameAction::ReserveGas => arena.reserve_gas(),
        GameAction::CleanState => arena.clean_state(),
    }
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!("../.metahash");
    msg::reply(metahash, 0).expect("Failed to share metahash");
}

#[no_mangle]
extern "C" fn state() {
    let arena = unsafe { ARENA.as_ref().unwrap() };

    msg::reply(
        ArenaState {
            mint: arena.mint,
            characters: arena.characters.clone(),
            reservations: arena.reservations.clone(),
            winners: arena.winners.clone(),
            battles: arena
                .battles
                .iter()
                .map(|battle| BattleState {
                    c1: battle.c1.clone(),
                    c2: battle.c2.clone(),
                })
                .collect(),
            leaderboard: arena.leaderboard.clone(),
        },
        0,
    )
    .expect("failed to share state");
}
