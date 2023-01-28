#![no_std]

use common::GameAction;
use gstd::{debug, msg};

#[gstd::async_main]
async fn main() {
    debug!("attaking");
    msg::send(msg::source(), GameAction::Attack, 0).expect("unable to send message");
    msg::reply("", 0).expect("unable to reply");
}
