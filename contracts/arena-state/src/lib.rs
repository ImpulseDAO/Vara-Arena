#![no_std]

use common::{ArenaMetadata, Character};
use gmeta::{metawasm, Metadata};
use gstd::prelude::*;

#[metawasm]
pub mod metafns {
    pub type State = <ArenaMetadata as Metadata>::State;

    pub fn registered(state: State) -> Vec<Character> {
        state.characters.clone()
    }
}
