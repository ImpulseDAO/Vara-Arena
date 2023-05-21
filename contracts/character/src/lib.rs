#![no_std]

use common::{AttackKind, BattleAction, YourTurn};
use gstd::{debug, msg};

const QUICK_ATTAK_ENERGY: u8 = 20;

#[gstd::async_main]
async fn main() {
    let turn: YourTurn = msg::load().expect("unable to decode `YourTurn`");

    if turn.you.position > turn.enemy.position {
        if turn.you.position - turn.enemy.position > 2 {
            debug!("moving toward the enemy");
            msg::reply(BattleAction::MoveLeft, 0).expect("unable to reply");
            return;
        }
    } else {
        if turn.enemy.position - turn.you.position > 2 {
            debug!("moving toward the enemy");
            msg::reply(BattleAction::MoveRight, 0).expect("unable to reply");
            return;
        }
    }

    if turn.you.energy >= QUICK_ATTAK_ENERGY {
        debug!("attaking");
        msg::reply(
            BattleAction::Attack {
                kind: AttackKind::Quick,
            },
            0,
        )
        .expect("unable to reply");
    } else {
        debug!("resting...");
        msg::reply(BattleAction::Rest, 0).expect("unable to reply");
    }
}
