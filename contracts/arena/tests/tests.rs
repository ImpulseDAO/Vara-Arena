use arena_io::ArenaAction;
use gstd::CodeId;
use gtest::{Program, System};
use mint_io::{InitialAttributes, MintAction};

const USER_ID: u64 = 10;
const USER2_ID: u64 = 20;
const USER3_ID: u64 = 30;
const USER4_ID: u64 = 40;

const ARENA_ID: u64 = 2;

#[test]
fn game() {
    let system = System::new();
    system.init_logger();

    let mint = Program::from_file(
        &system,
        "../../target/wasm32-unknown-unknown/release/mint.wasm",
    );
    mint.send(USER_ID, 0x00);

    let arena = Program::from_file(
        &system,
        "../../target/wasm32-unknown-unknown/release/arena.wasm",
    );
    arena.send(USER_ID, mint.id());

    mint.send(
        USER_ID,
        MintAction::SetArena {
            arena_id: (ARENA_ID.into()),
        },
    );

    let hash: [u8; 32] = system
        .submit_code("../../target/wasm32-unknown-unknown/release/berserk.wasm")
        .into();
    let code_id = CodeId::from(hash);

    let payload = MintAction::CreateCharacter {
        code_id,
        name: "Oleg".to_string(),
        attributes: InitialAttributes {
            agility: 2,
            strength: 3,
            stamina: 1,
            vitality: 2,
        },
    };
    mint.send(USER_ID, payload.clone());
    mint.send(USER2_ID, payload.clone());
    mint.send(USER3_ID, payload.clone());
    mint.send(USER4_ID, payload.clone());

    arena.send(
        USER_ID,
        ArenaAction::Register {
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER_ID,
        ArenaAction::Register {
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER2_ID,
        ArenaAction::Register {
            owner_id: USER2_ID.into(),
        },
    );
    arena.send(
        USER3_ID,
        ArenaAction::Register {
            owner_id: USER3_ID.into(),
        },
    );

    arena.send(
        USER4_ID,
        ArenaAction::Register {
            owner_id: USER4_ID.into(),
        },
    );

    arena.send(USER_ID, ArenaAction::ReserveGas);
    arena.send(USER_ID, ArenaAction::ReserveGas);

    arena.send(USER_ID, ArenaAction::Play);

    arena.send(USER_ID, ArenaAction::CleanState);

    mint.send(
        USER_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );
    mint.send(
        USER2_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );

    mint.send(
        USER3_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );

    arena.send(
        USER_ID,
        ArenaAction::Register {
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER2_ID,
        ArenaAction::Register {
            owner_id: USER2_ID.into(),
        },
    );
    arena.send(
        USER3_ID,
        ArenaAction::Register {
            owner_id: USER3_ID.into(),
        },
    );
    arena.send(
        USER4_ID,
        ArenaAction::Register {
            owner_id: USER4_ID.into(),
        },
    );
    arena.send(USER_ID, ArenaAction::ReserveGas);
    arena.send(USER_ID, ArenaAction::ReserveGas);

    arena.send(USER_ID, ArenaAction::Play);

    mint.send(
        USER_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );
    mint.send(
        USER2_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );

    mint.send(
        USER3_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );
    arena.send(
        USER_ID,
        ArenaAction::Register {
            owner_id: USER_ID.into(),
        },
    );
}
