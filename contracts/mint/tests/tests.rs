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
    mint.send(10, 0x00);
}
