#![no_std]

use common::{GameAction, YourTurn};
use gstd::{debug, msg, prelude::*, ActorId};

type CharacterId = ActorId;

struct State {
    characters: Vec<CharacterId>,
}

static mut STATE: Option<State> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    STATE = Some(State {
        characters: Vec::new(),
    });
}

async fn play(state: &State) {
    loop {
        for character in &state.characters {
            msg::send_for_reply(*character, YourTurn, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive reply");
        }
        break;
    }
}

#[gstd::async_main]
async fn main() {
    let state = unsafe { STATE.as_mut().unwrap() };

    let action: GameAction = msg::load().expect("unable to decode `GameAction`");
    match action {
        GameAction::Register { character } => {
            state.characters.push(character);
            debug!("character {:?} registered on the arena", character);
        }
        GameAction::Play => {
            debug!("starting the battle");
            play(state).await
        }
        GameAction::Attack => {
            debug!("attack received");
        }
        GameAction::MoveLeft => {}
        GameAction::MoveRight => {}
    }
}
