#![no_std]

use arena::Arena;
use arena_io::GameAction;
use gstd::{msg, prelude::*, ActorId};

mod arena;
mod battle;
mod execute;
mod spell;
mod utils;

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
        GameAction::CreateLobby => arena.create_lobby(),
        GameAction::Register { lobby_id, owner_id } => {
            arena.register(lobby_id, owner_id).await;
        }
        GameAction::Play { lobby_id } => arena.play(lobby_id).await,
        GameAction::ReserveGas { lobby_id } => arena.reserve_gas(lobby_id),
        GameAction::CleanState { lobby_id } => arena.clean_state(lobby_id),
    }
}

#[no_mangle]
extern "C" fn state() {
    let arena = unsafe { ARENA.as_ref().unwrap() };
    let state = arena.state();
    msg::reply(state, 0).expect("failed to share state");
}
