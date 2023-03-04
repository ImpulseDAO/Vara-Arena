#![no_std]

use common::{InitCharacter, InitialAttributes};
use gstd::prog::ProgramGenerator;
use gstd::{debug, msg, prelude::*, ActorId, CodeId};

type CharacterId = ActorId;

#[derive(Default)]
struct CharacterAttributes {
    strength: u8,
    agility: u8,
    vitality: u8,
    stamina: u8,
}

struct CharacterInfo {
    owner: ActorId,
    attributes: CharacterAttributes,
}

impl From<InitialAttributes> for CharacterAttributes {
    fn from(init: InitialAttributes) -> Self {
        CharacterAttributes { ..init.into() }
    }
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

    let init_character: InitCharacter = msg::load().expect("unable to decode `InitCharacter`");

    let (_, character_id) = ProgramGenerator::create_program_with_gas(
        init_character.code_id,
        b"payload",
        10_000_000_000,
        0,
    )
    .unwrap();

    let info = CharacterInfo {
        owner: msg::source(),
        attributes: CharacterAttributes::default(),
    };

    state.characters.insert(character_id, info);
    debug!("character {:?} minted", character_id);
    msg::reply(character_id, 0).expect("unable to reply");
}
