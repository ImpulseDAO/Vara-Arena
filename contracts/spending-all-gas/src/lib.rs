#![no_std]

use gstd::{debug, prelude::*};

#[no_mangle]
extern "C" fn handle() {
    debug!("spending gas");
    loop {}
}
