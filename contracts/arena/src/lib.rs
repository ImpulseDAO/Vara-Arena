#![no_std]

use common::{CharacterInfo, GameAction, MintAction, YourTurn};
use gstd::{debug, msg, prelude::*, ActorId};

const FIRST_POS: u8 = 4;
const SECOND_POS: u8 = 15;
const HP_MULTIPLIER: u8 = 30;
const BASE_HP: u8 = 10;

type CharacterId = ActorId;

#[allow(dead_code)]
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

impl Arena {
    async fn play(&self) {
        debug!("starting the battle");
        'outer: loop {
            for character in &self.characters {
                msg::send_for_reply(character.id, YourTurn, 0)
                    .expect("unable to send message")
                    .await
                    .expect("unable to receive reply");
                let opponent = self
                    .characters
                    .iter()
                    .find(|c| c.id != character.id)
                    .unwrap();
                if opponent.hp == 0 {
                    debug!("{:?} is a winner", character.id);
                    break 'outer;
                }
            }
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

    fn attack(&mut self) {
        debug!("attack received");
        let opponent = self
            .characters
            .iter_mut()
            .find(|c| c.id != msg::source())
            .unwrap();
        opponent.hp = opponent.hp.saturating_sub(5);
    }

    fn move_left(&mut self) {}

    fn move_right(&mut self) {}
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
        GameAction::Attack => arena.attack(),
        GameAction::MoveLeft => arena.move_left(),
        GameAction::MoveRight => arena.move_right(),
    }
}
