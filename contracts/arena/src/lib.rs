#![no_std]

use battle::{Battle, Character};
use common::{CharacterInfo, GameAction, MintAction};
use gstd::{debug, msg, prelude::*, ActorId};

mod battle;

const HP_MULTIPLIER: u8 = 30;
const BASE_HP: u8 = 10;
const ENERGY: [u8; 10] = [0, 110, 120, 130, 140, 150, 160, 170, 180, 190];

#[derive(Default)]
struct Arena {
    characters: Vec<Character>,
    mint: ActorId,
}

impl Arena {
    async fn play(&mut self) {
        debug!("starting the battle");
        let mut battles: Vec<Battle> = self
            .characters
            .chunks_exact(2)
            .map(|characters| Battle::new(characters[0].clone(), characters[1].clone()))
            .collect();

        loop {
            let mut winners = vec![];

            for battle in battles {
                let winner = battle.fight().await;
                winners.push(winner.id);
            }

            if winners.len() == 1 {
                break;
            }

            battles = winners
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
        }
    }

    async fn register(&mut self, character_id: ActorId) {
        let payload = MintAction::CharacterInfo { character_id };
        let character_info: CharacterInfo = msg::send_for_reply_as(self.mint, payload, 0)
            .expect("unable to send message")
            .await
            .expect("unable to receive reply");

        let character = Character {
            id: character_id,
            hp: character_info.attributes.vitality * HP_MULTIPLIER + BASE_HP,
            energy: ENERGY[usize::from(character_info.attributes.stamina)],
            position: 0.0,
            attributes: character_info.attributes,
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
