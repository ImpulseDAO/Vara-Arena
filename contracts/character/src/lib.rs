#![no_std]

use common::BattleAction;
use gstd::{debug, msg};

#[gstd::async_main]
async fn main() {
    debug!("attaking");
    msg::reply(BattleAction::Attack, 0).expect("unable to reply");
}
