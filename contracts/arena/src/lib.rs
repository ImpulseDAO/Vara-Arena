#![no_std]

use arena::Arena;
use arena_io::GameAction;
use gstd::{msg, prelude::*, ActorId};

mod arena;
mod battle;
mod execute;
mod spell;

static mut ARENA: Option<Arena> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    let mint: ActorId = msg::load().expect("unable to decode `ActorId`");
    ARENA = Some(Arena::new(mint));
}

#[gstd::async_main]
async fn main() {
    let arena = unsafe { ARENA.as_mut().unwrap() };
    let action: GameAction = msg::load().expect("unable to decode `GameAction`");
    match action {
        GameAction::Register { owner_id } => {
            arena.register(owner_id).await;
        }
        GameAction::Play => arena.play().await,
        GameAction::ReserveGas => arena.reserve_gas(),
        GameAction::CleanState => arena.clean_state(),
    }
}

#[no_mangle]
extern "C" fn state() {
    let arena = unsafe { ARENA.as_ref().unwrap() };
    let state = arena.state();
    msg::reply(state, 0).expect("failed to share state");
}
