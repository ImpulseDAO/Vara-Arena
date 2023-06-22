use common::{GameAction, InitialAttributes, MintAction};
use gstd::CodeId;
use gtest::{Program, System};

const USER_ID: u64 = 10;

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

    let hash: [u8; 32] = system
        .submit_code("../../target/wasm32-unknown-unknown/release/character.wasm")
        .into();
    let code_id = CodeId::from(hash);

    let payload = MintAction::CreateCharacter {
        code_id,
        name: "Oleg".to_string(),
        attributes: InitialAttributes {
            agility: 1,
            strength: 1,
            stamina: 1,
            vitality: 1,
        },
    };
    mint.send(USER_ID, payload.clone());
    mint.send(USER_ID, payload);

    arena.send(
        USER_ID,
        GameAction::Register {
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER_ID,
        GameAction::Register {
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER_ID,
        GameAction::Register {
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER_ID,
        GameAction::Register {
            owner_id: USER_ID.into(),
        },
    );

    arena.send(USER_ID, GameAction::ReserveGas);
    arena.send(USER_ID, GameAction::ReserveGas);

    arena.send(USER_ID, GameAction::Play);
}
