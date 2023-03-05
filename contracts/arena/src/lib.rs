#![no_std]

use common::{GameAction, YourTurn};
use gstd::{debug, msg, prelude::*, ActorId};

type CharacterId = ActorId;

struct Character {
    id: CharacterId,
    hp: i8,
}

#[derive(Default)]
struct Arena {
    characters: Vec<Character>,
}

impl Arena {
    async fn play(&self) {
        debug!("starting the battle");
        'outer: loop {
            for character in self.characters {
                msg::send_for_reply(character.id, YourTurn, 0)
                    .expect("unable to send message")
                    .await
                    .expect("unable to receive reply");
                let opponent = self
                    .characters
                    .iter()
                    .find(|c| c.id != character.id)
                    .unwrap();
                if opponent.hp <= 0 {
                    debug!("{:?} is a winner", character.id);
                    break 'outer;
                }
            }
        }
    }

    fn register(&mut self, actor: ActorId) {
        let character = Character { id: actor, hp: 50 };
        state.characters.push(character);
        debug!("character {:?} registered on the arena", character.id);
    }

    fn attack(&mut self) {
        debug!("attack received");
        let opponent = state
            .characters
            .iter_mut()
            .find(|c| c.id != msg::source())
            .unwrap();
        opponent.hp -= 5;
    }
}

static mut ARENA: Option<Arena> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    ARENA = Some(Arena::default());
}

#[gstd::async_main]
async fn main() {
    let arena = unsafe { ARENA.as_mut().unwrap() };
    let action: GameAction = msg::load().expect("unable to decode `GameAction`");
    match action {
        GameAction::Register { character } => {
            arena.register(character);
        }
        GameAction::Play => arena.play().await,
        GameAction::Attack => arena.attack(),
        GameAction::MoveLeft => {}
        GameAction::MoveRight => {}
    }
}
