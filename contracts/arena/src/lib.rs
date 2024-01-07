#![no_std]

use arena::Arena;
use arena_io::ArenaAction;
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
    let action: ArenaAction = msg::load().expect("unable to decode `GameAction`");
    match action {
        ArenaAction::CreateLobby { capacity } => arena.create_lobby(capacity),
        ArenaAction::Register { lobby_id, owner_id } => {
            arena.register(lobby_id, owner_id).await;
        }
        ArenaAction::Play { lobby_id } => arena.play(lobby_id).await,
        ArenaAction::ReserveGas { lobby_id } => arena.reserve_gas(lobby_id),
    }
}

#[no_mangle]
extern "C" fn state() {
    let arena = unsafe { ARENA.as_ref().unwrap() };
    let state = arena.state();
    msg::reply(state, 0).expect("failed to share state");
}
