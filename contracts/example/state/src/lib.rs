#![no_std]

use gmeta::metawasm;
use gstd::{prelude::*, ActorId};

#[gmeta::metawasm]
pub mod metafns {
    pub type State = ExampleMetaData;

    // Add custom state retrieval methods here
}
