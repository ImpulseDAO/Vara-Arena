#![no_std]

use battle::{Battle, Character, ENERGY};
use common::{CharacterInfo, GameAction, GameEvent, MintAction};
use gstd::{debug, msg, prelude::*, ActorId};

mod battle;

const HP_MULTIPLIER: u8 = 30;
const BASE_HP: u8 = 10;

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
                let winner = winners[0];
                msg::reply(GameEvent::PlayerWon(winner), 0).expect("unable to reply");
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

    async fn register(&mut self, owner_id: ActorId) {
        let payload = MintAction::CharacterInfo { owner_id };
        let character_info: CharacterInfo = msg::send_for_reply_as(self.mint, payload, 0)
            .expect("unable to send message")
            .await
            .expect("unable to receive reply");

        let character = Character {
            id: character_info.id,
            hp: character_info.attributes.vitality * HP_MULTIPLIER + BASE_HP,
            energy: ENERGY[usize::from(character_info.attributes.stamina)],
            position: 0,
            attributes: character_info.attributes,
        };

        debug!("character {:?} registered on the arena", character.id);
        self.characters.push(character);

        msg::reply(GameEvent::PlayerRegistered(character_info.id), 0).expect("unable to reply");
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
    }
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!("../.metahash");
    msg::reply(metahash, 0).expect("Failed to share metahash");
}
