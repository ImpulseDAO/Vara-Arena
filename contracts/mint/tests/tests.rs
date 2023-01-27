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

    let code_id = system.submit_code("../../target/wasm32-unknown-unknown/release/character.wasm");
    mint.send(10, code_id);
}
