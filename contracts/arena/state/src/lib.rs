#![no_std]

use arena_io::ArenaMetadata;
use gmeta::{metawasm, Metadata};
use gstd::{prelude::*, ActorId};

#[metawasm]
pub mod metafns {
    pub type State = <ArenaMetadata as Metadata>::State;

    pub fn leaderboard(state: State) -> BTreeMap<ActorId, u32> {
        state.leaderboard
    }
}
