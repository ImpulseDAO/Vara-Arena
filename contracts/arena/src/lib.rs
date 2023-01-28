#![no_std]

use common::{GameAction, YourTurn};
use gstd::{debug, msg, prelude::*, ActorId};

type CharacterId = ActorId;

struct Character {
    id: CharacterId,
    hp: i8,
}

struct State {
    characters: Vec<Character>,
}

static mut STATE: Option<State> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    STATE = Some(State {
        characters: Vec::new(),
    });
}

async fn play(state: &State) {
    'outer: loop {
        for character in &state.characters {
            msg::send_for_reply(character.id, YourTurn, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive reply");
            let opponent = state
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

#[gstd::async_main]
async fn main() {
    let state = unsafe { STATE.as_mut().unwrap() };

    let action: GameAction = msg::load().expect("unable to decode `GameAction`");
    match action {
        GameAction::Register { character } => {
            let character = Character {
                id: character,
                hp: 50,
            };
            debug!("character {:?} registered on the arena", character.id);
            state.characters.push(character);
        }
        GameAction::Play => {
            debug!("starting the battle");
            play(state).await
        }
        GameAction::Attack => {
            debug!("attack received");
            let opponent = state
                .characters
                .iter_mut()
                .find(|c| c.id != msg::source())
                .unwrap();
            opponent.hp -= 5;
        }
        GameAction::MoveLeft => {}
        GameAction::MoveRight => {}
    }
}
