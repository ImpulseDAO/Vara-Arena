#![no_std]

use common::{CharacterAttributes, CharacterInfo, InitialAttributes, MintAction};
use gstd::prog::ProgramGenerator;
use gstd::{debug, msg, prelude::*, ActorId, CodeId};

type CharacterId = ActorId;

#[derive(Default)]
struct Mint {
    characters: BTreeMap<CharacterId, CharacterInfo>,
}

static mut MINT: Option<Mint> = None;

impl Mint {
    fn create_character(&mut self, code_id: CodeId, attributes: InitialAttributes) {
        let (_, character_id) =
            ProgramGenerator::create_program_with_gas(code_id, b"payload", 10_000_000_000, 0)
                .unwrap();

        let info = CharacterInfo {
            owner: msg::source(),
            attributes: CharacterAttributes {
                strength: attributes.strength,
                agility: attributes.agility,
                vitality: attributes.vitality,
                stamina: attributes.stamina,
            },
        };

        self.characters.insert(character_id, info);
        debug!("character {:?} minted", character_id);
        msg::reply(character_id, 0).expect("unable to reply");
    }

    fn character_info(&self, character_id: CharacterId) {
        let character = self
            .characters
            .get(&character_id)
            .expect("character doesn't exist");
        msg::reply(character, 0).expect("unable to reply");
    }
}

#[no_mangle]
unsafe extern "C" fn init() {
    MINT = Some(Mint::default());
}

#[no_mangle]
extern "C" fn handle() {
    let mint = unsafe { MINT.as_mut().unwrap() };
    let action: MintAction = msg::load().expect("unable to decode `MintAction`");
    match action {
        MintAction::CreateCharacter {
            code_id,
            attributes,
        } => {
            mint.create_character(code_id, attributes);
        }
        MintAction::CharacterInfo { character_id } => mint.character_info(character_id),
    }
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!("../.metahash");
    msg::reply(metahash, 0).expect("Failed to share metahash");
}
