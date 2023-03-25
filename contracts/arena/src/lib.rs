#![no_std]

use common::{CharacterInfo, GameAction, MintAction, YourTurn};
use gstd::{debug, msg, prelude::*, ActorId};

const FIRST_POS: u8 = 4;
const SECOND_POS: u8 = 15;
const HP_MULTIPLIER: u8 = 30;
const BASE_HP: u8 = 10;

type CharacterId = ActorId;

#[derive(Clone)]
struct Character {
    id: CharacterId,
    hp: u8,
    position: u8,
}

#[derive(Default)]
struct Arena {
    characters: Vec<Character>,
    mint: ActorId,
}

struct Pair {
    c1: Character,
    c2: Character,
}

impl Arena {
    async fn play(&mut self) {
        debug!("starting the battle");
        let mut pairs: Vec<Pair> = self
            .characters
            .chunks_exact(2)
            .map(|characters| Pair {
                c1: characters[0].clone(),
                c2: characters[1].clone(),
            })
            .collect();

        loop {
            let mut winners = vec![];
            for pair in &mut pairs {
                'battle: loop {
                    msg::send_for_reply(pair.c1.id, YourTurn, 0)
                        .expect("unable to send message")
                        .await
                        .expect("unable to receive reply");
                    pair.c2.hp = pair.c2.hp.saturating_sub(5);
                    if pair.c2.hp == 0 {
                        debug!("{:?} is a winner", pair.c1.id);
                        winners.push(pair.c1.id);
                        break 'battle;
                    }

                    msg::send_for_reply(pair.c2.id, YourTurn, 0)
                        .expect("unable to send message")
                        .await
                        .expect("unable to receive reply");
                    pair.c1.hp = pair.c1.hp.saturating_sub(5);
                    if pair.c1.hp == 0 {
                        debug!("{:?} is a winner", pair.c2.id);
                        winners.push(pair.c2.id);
                        break 'battle;
                    }
                }
            }

            if winners.len() == 1 {
                break;
            }

            pairs = winners
                .chunks_exact(2)
                .map(|characters| Pair {
                    c1: self
                        .characters
                        .iter()
                        .find(|c| c.id == characters[0])
                        .unwrap()
                        .clone(),
                    c2: self
                        .characters
                        .iter()
                        .find(|c| c.id == characters[1])
                        .unwrap()
                        .clone(),
                })
                .collect();
        }
    }

    async fn register(&mut self, character_id: ActorId) {
        let payload = MintAction::CharacterInfo { character_id };
        let character_info: CharacterInfo = msg::send_for_reply_as(self.mint, payload, 0)
            .expect("unable to send message")
            .await
            .expect("unable to receive reply");

        let position = if self.characters.is_empty() {
            FIRST_POS
        } else {
            SECOND_POS
        };

        let character = Character {
            id: character_id,
            hp: character_info.attributes.vitality * HP_MULTIPLIER + BASE_HP,
            position,
        };

        debug!("character {:?} registered on the arena", character.id);
        self.characters.push(character);
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
        GameAction::Register { character } => {
            arena.register(character).await;
        }
        GameAction::Play => arena.play().await,
    }
}
