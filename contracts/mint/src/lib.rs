#![no_std]

use gstd::prog::ProgramGenerator;
use gstd::{debug, msg, prelude::*, ActorId, CodeId};

type CharacterId = ActorId;

struct CharacterInfo {
    owner: ActorId,
}

struct State {
    characters: BTreeMap<CharacterId, CharacterInfo>,
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
    let state = unsafe { STATE.as_mut().unwrap() };

    let submitted_code: CodeId =
        hex_literal::hex!("abf3746e72a6e8740bd9e12b879fbdd59e052cb390f116454e9116c22021ae4a")
            .into();
    let (_, character_id) =
        ProgramGenerator::create_program_with_gas(submitted_code, b"payload", 10_000_000_000, 0)
            .unwrap();

    let owner = msg::source();
    let info = CharacterInfo { owner };

    state.characters.insert(character_id, info);
    debug!("character {:?} minted", character_id);
}
