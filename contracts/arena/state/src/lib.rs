#![no_std]

use arena_io::{ArenaMetadata, Character};
use gmeta::{metawasm, Metadata};
use gstd::prelude::*;

#[metawasm]
pub mod metafns {
    pub type State = <ArenaMetadata as Metadata>::State;

    pub fn registered(state: State) -> Vec<Character> {
        state.characters.clone()
    }
}
