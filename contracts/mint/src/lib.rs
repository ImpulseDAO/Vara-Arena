#![no_std]

use gstd::prog::ProgramGenerator;
use gstd::{debug, msg, prelude::*, ActorId, CodeId};
use mint_io::{CharacterAttributes, CharacterInfo, InitialAttributes, MintAction, MintState};

type CharacterId = ActorId;

#[derive(Default)]
struct Mint {
    characters: BTreeMap<CharacterId, CharacterInfo>,
    arena_contract: ActorId,
}

static mut MINT: Option<Mint> = None;

impl Mint {
    fn create_character(&mut self, code_id: CodeId, name: String, attributes: InitialAttributes) {
        let (_, character_id) =
            ProgramGenerator::create_program_with_gas(code_id, b"payload", 10_000_000_000, 0)
                .unwrap();

        let info = CharacterInfo {
            id: character_id,
            name,
            attributes: CharacterAttributes {
                strength: attributes.strength,
                agility: attributes.agility,
                vitality: attributes.vitality,
                stamina: attributes.stamina,
                level: 0,
                experience: 0,
            },
        };

        self.characters.insert(msg::source(), info);
        debug!("character {:?} minted", character_id);
        msg::reply(character_id, 0).expect("unable to reply");
    }

    fn character_info(&self, owner_id: CharacterId) {
        let character = self
            .characters
            .get(&owner_id)
            .expect("user has no character");
        msg::reply(character, 0).expect("unable to reply");
    }

    fn increase_xp(&mut self, owner_id: CharacterId) {
        let caller = msg::source();

        assert!(
            caller == self.arena_contract,
            "only the arena contract can call this fn"
        );

        let mut character = self.characters.get(&owner_id).expect("invalid owner_id");
        character.attributes.increase_xp();
    }
}

#[no_mangle]
unsafe extern "C" fn init() {
    let arean_contract: ActorId = msg::load().expect("Can't load id of arena contract");
    MINT = Some(Mint {
        arena_contract,
        characters: BTreeMap::default(),
    });
}

#[no_mangle]
extern "C" fn handle() {
    let mint = unsafe { MINT.as_mut().unwrap() };
    let action: MintAction = msg::load().expect("unable to decode `MintAction`");
    match action {
        MintAction::CreateCharacter {
            code_id,
            name,
            attributes,
        } => {
            mint.create_character(code_id, name, attributes);
        }
        MintAction::CharacterInfo { owner_id } => mint.character_info(owner_id),
        MintAction::BattleResult { winner_id } => mint.increase_xp(winner_id),
    }
}

#[no_mangle]
extern "C" fn state() {
    let mint = unsafe { MINT.as_ref().unwrap() };
    msg::reply(
        MintState {
            characters: mint.characters.clone(),
        },
        0,
    )
    .expect("failed to share state");
}
