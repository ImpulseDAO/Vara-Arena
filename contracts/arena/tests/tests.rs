use codec::Decode;
use common::GameAction;
use gstd::ActorId;
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
    arena.send(USER_ID, 0x00);

    let code_id = system.submit_code("../../target/wasm32-unknown-unknown/release/character.wasm");
    let character1 = ActorId::decode(&mut mint.send(USER_ID, code_id).log()[0].payload()).unwrap();
    let character2 = ActorId::decode(&mut mint.send(USER_ID, code_id).log()[0].payload()).unwrap();

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
