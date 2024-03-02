#![no_std]

use gstd::debug;

#[no_mangle]
extern "C" fn handle() {
    debug!("spending gas");
    loop {}
}
