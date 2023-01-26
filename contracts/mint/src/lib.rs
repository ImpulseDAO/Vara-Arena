#![no_std]

use gstd::{debug, msg, prelude::*, ActorId};

struct CharacterInfo {}

struct State {
    characters: BTreeMap<ActorId, CharacterInfo>,
}

static mut STATE: Option<State> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    STATE = Some(State {
        characters: BTreeMap::new(),
    });
}

#[no_mangle]
extern "C" fn handle() {
    let address = msg::load::<ActorId>().expect("invalid message");

    let state = unsafe { STATE.as_mut().unwrap() };
    state.characters.insert(address, CharacterInfo {});
    debug!("character {:?} registered", address);
}
