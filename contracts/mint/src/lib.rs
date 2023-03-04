#![no_std]

use common::CreateCharacter;
use gstd::prog::ProgramGenerator;
use gstd::{debug, msg, prelude::*, ActorId};

type CharacterId = ActorId;

#[allow(dead_code)]
#[derive(Default)]
struct CharacterAttributes {
    strength: u8,
    agility: u8,
    vitality: u8,
    stamina: u8,
}

#[allow(dead_code)]
struct CharacterInfo {
    owner: ActorId,
    attributes: CharacterAttributes,
}

#[derive(Default)]
struct Mint {
    characters: BTreeMap<CharacterId, CharacterInfo>,
}

static mut MINT: Option<Mint> = None;

impl Mint {
    fn create_character(&mut self, payload: CreateCharacter) {
        let (_, character_id) = ProgramGenerator::create_program_with_gas(
            payload.code_id,
            b"payload",
            10_000_000_000,
            0,
        )
        .unwrap();

        let info = CharacterInfo {
            owner: msg::source(),
            attributes: CharacterAttributes {
                strength: payload.attributes.strength,
                agility: payload.attributes.agility,
                vitality: payload.attributes.vitality,
                stamina: payload.attributes.stamina,
            },
        };

        self.characters.insert(character_id, info);
        debug!("character {:?} minted", character_id);
        msg::reply(character_id, 0).expect("unable to reply");
    }
}

#[no_mangle]
unsafe extern "C" fn init() {
    MINT = Some(Mint::default());
}

#[no_mangle]
extern "C" fn handle() {
    let mint = unsafe { MINT.as_mut().unwrap() };
    let payload: CreateCharacter = msg::load().expect("unable to decode `CreateCharacter`");
    mint.create_character(payload);
}
