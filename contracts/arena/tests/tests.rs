use codec::Decode;
use common::{GameAction, InitialAttributes, MintAction};
use gstd::{ActorId, CodeId};
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
        attributes: InitialAttributes {
            agility: 1,
            strength: 1,
            stamina: 1,
            vitality: 1,
        },
    };
    let character1 =
        ActorId::decode(&mut mint.send(USER_ID, payload.clone()).log()[0].payload()).unwrap();
    let character2 = ActorId::decode(&mut mint.send(USER_ID, payload).log()[0].payload()).unwrap();

    arena.send(
        USER_ID,
        GameAction::Register {
            character: character1,
        },
    );
    arena.send(
        USER_ID,
        GameAction::Register {
            character: character2,
        },
    );

    arena.send(USER_ID, GameAction::Play);
}
