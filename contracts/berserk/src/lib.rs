#![no_std]

use arena_io::{AttackKind, BattleAction, YourTurn};
use gstd::{debug, msg};

const HEAVY_ATTAK_ENERGY: u8 = 6;

#[gstd::async_main]
async fn main() {
    let turn: YourTurn = msg::load().expect("unable to decode `YourTurn`");

    // TODO::
    // add a turn.you.rest_count check for a better performance ;)

    if turn.you.position > turn.enemy.position && turn.you.position - turn.enemy.position > 1 {
        debug!("moving toward the enemy");
        msg::reply(BattleAction::MoveLeft, 0).expect("unable to reply");
        return;
    } else if turn.enemy.position > turn.you.position && turn.enemy.position - turn.you.position > 1
    {
        debug!("moving toward the enemy");
        msg::reply(BattleAction::MoveRight, 0).expect("unable to reply");
        return;
    }

    if turn.you.energy >= HEAVY_ATTAK_ENERGY {
        debug!("attaking");
        msg::reply(
            BattleAction::Attack {
                kind: AttackKind::Heavy,
            },
            0,
        )
        .expect("unable to reply");
    } else {
        debug!("resting...");
        msg::reply(BattleAction::Rest, 0).expect("unable to reply");
    }
}
