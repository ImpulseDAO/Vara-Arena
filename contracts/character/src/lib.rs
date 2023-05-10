#![no_std]

use common::{AttackKind, BattleAction, YourTurn};
use gstd::{debug, msg};

#[gstd::async_main]
async fn main() {
    let turn: YourTurn = msg::load().expect("unable to decode `YourTurn`");
    debug!("attaking");
    msg::reply(
        BattleAction::Attack {
            kind: AttackKind::Normal,
        },
        0,
    )
    .expect("unable to reply");
}
