#![no_std]

use gmeta::metawasm;
use gstd::ActorId;
use mint_io::{CharacterInfo, MintState};

#[metawasm]
pub mod metafns {
    pub type State = MintState;

    pub fn character_info(state: State, owner_id: ActorId) -> Option<CharacterInfo> {
        state.characters.get(&owner_id).cloned()
    }
}
