#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata, Out};
use gstd::{prelude::*, TypeInfo};

#[derive(Encode, Decode, TypeInfo, Clone, Default)]
pub struct ExampleMetaData {
    pub turn_count: u128,
    pub rest_count: u128,
}

impl ExampleMetaData {
    pub fn new() -> ExampleMetaData {
        ExampleMetaData {
            turn_count: 0,
            rest_count: 0,
            ..Default::default()
        }
    }

    pub fn state(&self) -> ExampleMetaData {
        ExampleMetaData {
            turn_count: self.turn_count,
            rest_count: self.rest_count,
        }
    }
}

impl Metadata for ExampleMetaData {
    type Init = ();
    type Handle = ();
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = Out<ExampleMetaData>;
}
