#![no_std]

use arena_io::{BattleAction, Spell, YourTurn};
use gstd::{debug, msg};

const SPELL_COST: u8 = 5;

#[gstd::async_main]
async fn main() {
    let turn: YourTurn = msg::load().expect("unable to decode `YourTurn`");

    if turn.you.energy >= SPELL_COST && turn.you.fire_wall == (0, 0) {
        debug!("CASTING WALL...");
        msg::reply(
            BattleAction::CastSpell {
                spell: Spell::FireWall,
            },
            0,
        )
        .expect("unable to reply");
    } else if turn.you.energy >= SPELL_COST {
        debug!("CASTING FIREBALL");
        msg::reply(
            BattleAction::CastSpell {
                spell: Spell::Fireball,
            },
            0,
        )
        .expect("unable to reply");
    } else {
        debug!("resting...");
        msg::reply(BattleAction::Rest, 0).expect("unable to reply");
    }
}
