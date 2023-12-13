#![no_std]

use arena_io::ArenaState;
use gmeta::metawasm;
use gstd::collections::BTreeMap;
use gstd::{prelude::*, ActorId};

#[metawasm]
pub mod metafns {
    pub type State = ArenaState;

    pub fn leaderboard(state: State) -> BTreeMap<ActorId, u32> {
        state.leaderboard
    }
}
