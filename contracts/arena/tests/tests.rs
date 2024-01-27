use arena_io::*;
use gstd::CodeId;
use gtest::{Program, System};
use mint_io::{Config, InitialAttributes, MintAction};

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

    let arena = Program::from_file(
        &system,
        "../../target/wasm32-unknown-unknown/release/arena.wasm",
    );

    let config = mint_io::Config {
        lives_count: 5,
        gas_for_daily_distribution: 20000000000,
        minimum_gas_amount: 20000000000,
        update_interval_in_blocks: 28800,
        reservation_amount: 700000000000,
        reservation_duration: 1200,
        mint_cost: Some(10000000000000),
        gold_pool_amount: 100,
        season_duration_in_days: 7,
    };

    mint.send(USER_ID, config);
    mint.send(
        USER_ID,
        MintAction::SetArena {
            arena_id: (ARENA_ID.into()),
        },
    );

    arena.send(USER_ID, mint.id());

    let hash: [u8; 32] = system
        .submit_code("../../target/wasm32-unknown-unknown/release/character.wasm")
        .into();
    let code_id = CodeId::from(hash);

    let hash2: [u8; 32] = system
        .submit_code("../../target/wasm32-unknown-unknown/release/mage.wasm")
        .into();
    let code_id2 = CodeId::from(hash2);

    let payload1 = MintAction::CreateCharacter {
        code_id: code_id2,
        name: "Alice".to_string(),
        attributes: InitialAttributes {
            agility: 1,
            strength: 1,
            stamina: 1,
            intelligence: 6,
        },
    };

    let payload2 = MintAction::CreateCharacter {
        code_id,
        name: "Bob".to_string(),
        attributes: InitialAttributes {
            agility: 1,
            strength: 4,
            stamina: 1,
            intelligence: 1,
        },
    };

    let payload3 = MintAction::CreateCharacter {
        code_id,
        name: "Che".to_string(),
        attributes: InitialAttributes {
            agility: 4,
            strength: 3,
            stamina: 1,
            intelligence: 1,
        },
    };

    let payload4 = MintAction::CreateCharacter {
        code_id,
        name: "Dua".to_string(),
        attributes: InitialAttributes {
            agility: 1,
            strength: 6,
            stamina: 1,
            intelligence: 1,
        },
    };

    system.mint_to(USER_ID, 100000000000000);
    system.mint_to(USER2_ID, 100000000000000);
    system.mint_to(USER3_ID, 100000000000000);
    system.mint_to(USER4_ID, 100000000000000);

    mint.send_with_value(USER_ID, payload1, 10000000000000);
    mint.send_with_value(USER2_ID, payload2, 10000000000000);
    mint.send_with_value(USER3_ID, payload3, 10000000000000);
    mint.send_with_value(USER4_ID, payload4, 10000000000000);

    arena.send(USER_ID, ArenaAction::CreateLobby { capacity: (4) });

    arena.send(
        USER_ID,
        ArenaAction::Register {
            lobby_id: 0,
            owner_id: USER_ID.into(),
        },
    );
    arena.send(
        USER2_ID,
        ArenaAction::Register {
            lobby_id: 0,
            owner_id: USER2_ID.into(),
        },
    );
    arena.send(
        USER3_ID,
        ArenaAction::Register {
            lobby_id: 0,
            owner_id: USER3_ID.into(),
        },
    );

    arena.send(
        USER4_ID,
        ArenaAction::Register {
            lobby_id: 0,
            owner_id: USER4_ID.into(),
        },
    );

    arena.send(USER_ID, ArenaAction::ReserveGas { lobby_id: 0 });
    arena.send(USER_ID, ArenaAction::ReserveGas { lobby_id: 0 });

    arena.send(USER_ID, ArenaAction::Play { lobby_id: 0 });

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

    mint.send(
        USER4_ID,
        MintAction::LevelUp {
            attr: (mint_io::AttributeChoice::Strength),
        },
    );

    arena.send(USER_ID, ArenaAction::CreateLobby { capacity: (2) });

    arena.send(
        USER_ID,
        ArenaAction::Register {
            lobby_id: 1,
            owner_id: USER_ID.into(),
        },
    );

    arena.send(
        USER4_ID,
        ArenaAction::Register {
            lobby_id: 1,
            owner_id: USER4_ID.into(),
        },
    );

    arena.send(USER_ID, ArenaAction::Play { lobby_id: 1 });

    // arena.send(
    //     USER_ID,
    //     ArenaAction::Register {
    //         owner_id: USER_ID.into(),
    //     },
    // );
    // arena.send(
    //     USER2_ID,
    //     ArenaAction::Register {
    //         owner_id: USER2_ID.into(),
    //     },
    // );
    // arena.send(
    //     USER3_ID,
    //     ArenaAction::Register {
    //         owner_id: USER3_ID.into(),
    //     },
    // );
    // arena.send(
    //     USER4_ID,
    //     ArenaAction::Register {
    //         owner_id: USER4_ID.into(),
    //     },
    // );
    // arena.send(USER_ID, ArenaAction::ReserveGas);
    // arena.send(USER_ID, ArenaAction::ReserveGas);

    // arena.send(USER_ID, ArenaAction::Play);

    // mint.send(
    //     USER_ID,
    //     MintAction::LevelUp {
    //         attr: (mint_io::AttributeChoice::Strength),
    //     },
    // );
    // mint.send(
    //     USER2_ID,
    //     MintAction::LevelUp {
    //         attr: (mint_io::AttributeChoice::Strength),
    //     },
    // );

    // mint.send(
    //     USER3_ID,
    //     MintAction::LevelUp {
    //         attr: (mint_io::AttributeChoice::Strength),
    //     },
    // );
    // arena.send(
    //     USER_ID,
    //     ArenaAction::Register {
    //         owner_id: USER_ID.into(),
    //     },
    // );
}
