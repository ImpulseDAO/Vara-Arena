#![no_std]

use gstd::debug;

#[no_mangle]
extern "C" fn handle() {
    debug!("character handle");
}
