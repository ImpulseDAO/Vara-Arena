use gstd::CodeId;
use gtest::{Program, System};
use mint_io::{Config, InitialAttributes, MintAction, MintState};

#[test]
fn gold_distribution() {
    let system = System::new();
    system.init_logger();
    let mint = Program::current(&system);

    let hash: [u8; 32] = system
        .submit_code("../../target/wasm32-unknown-unknown/release/character.wasm")
        .into();
    let code_id = CodeId::from(hash);

    let mint_cost = 100_000_000_000_000;
    let update_interval_in_blocks = 86_400;
    let result = mint.send(
        10,
        Config {
            lives_count: 5,
            gas_for_daily_distribution: 5_000_000_000,
            minimum_gas_amount: 1_000_000_000,
            update_interval_in_blocks,
            reservation_amount: 500_000_000_000,
            reservation_duration: 2_592_000,
            mint_cost: Some(mint_cost),
            gold_pool_amount: 1000,
            season_duration_in_days: 7,
        },
    );

    assert!(!result.main_failed());

    system.mint_to(10, 100_000_000_000_000);
    let result = mint.send_with_value(
        10,
        MintAction::CreateCharacter {
            code_id,
            name: "Alice".to_string(),
            attributes: InitialAttributes {
                agility: 1,
                strength: 1,
                stamina: 1,
                intelligence: 6,
            },
        },
        mint_cost,
    );

    assert!(!result.main_failed());

    let result = mint.send(10, MintAction::StartDailyGoldDistribution);
    assert!(!result.main_failed());

    // just for testing

    let result = mint.send(
        10,
        MintAction::SetArena {
            arena_id: 10.into(),
        },
    );

    assert!(!result.main_failed());

    let result = mint.send(
        10,
        MintAction::BattleResult {
            owner_id: 10.into(),
            character_id: 0,
            losers: vec![],
            reply_to: 10.into(),
        },
    );

    assert!(!result.main_failed());

    let characters: MintState = mint.read_state(false).expect("Unable to decode");
    let MintState { characters } = characters;

    assert!(!result.main_failed());
    system.spend_blocks(update_interval_in_blocks);

    let characters: MintState = mint.read_state(false).expect("Unable to decode");
    println!("characters {:?}", characters);

    system.spend_blocks(update_interval_in_blocks);

    let characters: MintState = mint.read_state(false).expect("Unable to decode");
    println!("characters {:?}", characters);

    system.spend_blocks(update_interval_in_blocks);

    let characters: MintState = mint.read_state(false).expect("Unable to decode");
    println!("characters {:?}", characters);
}
