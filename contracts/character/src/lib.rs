#![no_std]

use common::{AttackKind, BattleAction};
use gstd::{debug, msg};

#[gstd::async_main]
async fn main() {
    debug!("attaking");
    msg::reply(
        BattleAction::Attack {
            kind: AttackKind::Normal,
        },
        0,
    )
    .expect("unable to reply");
}
