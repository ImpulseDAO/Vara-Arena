#![no_std]

use codec::{Decode, Encode};
use gstd::{debug, msg, prelude::*, ActorId};

type CharacterId = ActorId;

struct State {
    characters: Vec<CharacterId>,
}

static mut STATE: Option<State> = None;

#[derive(Encode, Decode)]
pub enum Message {
    Register { character: CharacterId },
}

#[no_mangle]
unsafe extern "C" fn init() {
    STATE = Some(State {
        characters: Vec::new(),
    });
}

#[no_mangle]
extern "C" fn handle() {
    let state = unsafe { STATE.as_mut().unwrap() };

    let message: Message = msg::load().expect("unable to decode `Message`");
    match message {
        Message::Register { character } => {
            state.characters.push(character);
            debug!("character {:?} registered on the arena", character);
        }
    }
}
