#![no_std]

use gstd::{debug, msg};

#[gstd::async_main]
async fn main() {
    debug!("attaking");
    msg::reply("", 0).expect("unable to reply");
}
