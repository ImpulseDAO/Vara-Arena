#![no_std]

use gstd::{debug, msg};

#[no_mangle]
extern "C" fn handle() {
    debug!("wrong reply");
    msg::reply_bytes(b"hello", 0).expect("Error in reply");
}
