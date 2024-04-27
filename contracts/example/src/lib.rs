#![no_std]

use arena_io::{AttackKind, BattleAction, Spell, YourTurn};
use arena_io::{
    AttackResult, BattleLog, BattleState, CastSpellResult, Character, CharacterState, SetTier,
    TurnEvent, TurnLog,
};
use example_io::ExampleMetaData;
use gstd::{debug, msg};
use mint_io::{CharacterAttributes, CharacterInfo, MintAction, MintMetadata, MintState};

static mut EXAMPLE: Option<ExampleMetaData> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    EXAMPLE = Some(ExampleMetaData::new());
}

#[no_mangle]
extern "C" fn state() {
    let example = unsafe { EXAMPLE.as_ref().unwrap() };
    let state = example.state();
    msg::reply(state, 0).expect("failed to share state");
}

fn update_example(example: Option<ExampleMetaData>) {
    unsafe {
        EXAMPLE = example;
    }
}

#[gstd::async_main]
async fn main() {
    debug!("STRATEGY: example strategy #1");

    let turn: YourTurn = msg::load().expect("unable to decode `YourTurn`");

    let example = unsafe { EXAMPLE.as_mut().unwrap() };

    let mut my_turn_count = example.state().turn_count;
    let mut my_rest_count = example.state().rest_count;

    // update local variable value
    my_turn_count = my_turn_count + 1;

    // update state value
    update_example(Some(ExampleMetaData {
        turn_count: my_turn_count,
        rest_count: my_rest_count,
    }));

    // strategy:
    // * only rest twice in the game to recover, and only on every third turn, then
    // * give up and don't bother resting anymore even if it costs nothing
    if my_turn_count % 3 == 0
        && my_rest_count <= 2 {

        debug!("ACTION: resting");
        msg::reply(BattleAction::Rest, 0).expect("unable to reply");

        // update local variable value
        my_rest_count = my_rest_count + 1;

        // update state value
        update_example(Some(ExampleMetaData {
            turn_count: my_turn_count,
            rest_count: my_rest_count,
        }));

        return;
    }

    return;
}
