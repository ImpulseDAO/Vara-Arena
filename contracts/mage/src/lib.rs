#![no_std]

use arena_io::{AttackKind, BattleAction, Spell, YourTurn};
use gstd::{debug, msg};

const SPELL_COST: u8 = 5;
const QUICK_ATTACK_COST: u8 = 2;

#[gstd::async_main]
async fn main() {
    let turn: YourTurn = msg::load().expect("unable to decode `YourTurn`");

    // TODO::
    // add a turn.you.rest_count check to improve your strategy ;)
    if turn.you.energy >= SPELL_COST
        && (turn.enemy.position - turn.you.position != 1
            && turn.you.position - turn.enemy.position != 1)
    {
        msg::reply(
            BattleAction::CastSpell {
                spell: Spell::Fireball,
            },
            0,
        )
        .expect("unable to reply");
    } else if turn.you.energy >= SPELL_COST && turn.you.fire_wall.0 == 0 {
        debug!("fire Wall");

        msg::reply(
            BattleAction::CastSpell {
                spell: Spell::FireWall,
            },
            0,
        )
        .expect("unable to reply");
    } else if (turn.enemy.position - turn.you.position == 1
        || turn.you.position - turn.enemy.position == 1)
        && turn.you.energy >= QUICK_ATTACK_COST
    {
        debug!("MAGE attaking");
        msg::reply(
            BattleAction::Attack {
                kind: AttackKind::Quick,
            },
            0,
        )
        .expect("unable to reply");
    } else {
        debug!("agi 1...");
        msg::reply(BattleAction::Rest, 0).expect("unable to reply");
    }
}
