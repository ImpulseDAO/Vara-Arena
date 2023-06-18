#![no_std]

use common::{CharacterInfo, MintMetadata};
use gmeta::{metawasm, Metadata};
use gstd::ActorId;

#[metawasm]
pub mod metafns {
    pub type State = <MintMetadata as Metadata>::State;

    pub fn character_info(state: State, owner_id: ActorId) -> Option<CharacterInfo> {
        state.characters.get(&owner_id).cloned()
    }
}
