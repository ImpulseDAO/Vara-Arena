use arena::Message;
use codec::Decode;
use gstd::ActorId;
use gtest::{Program, System};

#[test]
fn game() {
    let system = System::new();
    system.init_logger();

    let mint = Program::from_file(
        &system,
        "../../target/wasm32-unknown-unknown/release/mint.wasm",
    );
    mint.send(10, 0x00);

    let arena = Program::from_file(
        &system,
        "../../target/wasm32-unknown-unknown/release/arena.wasm",
    );
    arena.send(10, 0x00);

    let code_id = system.submit_code("../../target/wasm32-unknown-unknown/release/character.wasm");
    let character1 = ActorId::decode(&mut mint.send(10, code_id).log()[0].payload()).unwrap();
    let character2 = ActorId::decode(&mut mint.send(10, code_id).log()[0].payload()).unwrap();

    arena.send(
        10,
        Message::Register {
            character: character1,
        },
    );
    arena.send(
        10,
        Message::Register {
            character: character2,
        },
    );
}
