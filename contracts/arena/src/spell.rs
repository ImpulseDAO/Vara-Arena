use arena_io::{Character, Spell, TurnAction};

pub fn execute_cast_spell(
    player: &mut Character,
    enemy: &mut Character,
    spell: &Spell,
) -> TurnAction {
    match spell {
        Spell::Fireball => {
            if let Some(energy) = player.energy.checked_sub(40) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
        Spell::EarthCatapult => {
            if let Some(energy) = player.energy.checked_sub(20) {
                player.energy = energy;
                let energy_damage = 10 + player.attributes.intelligence * 2;
                enemy.energy = enemy.energy.saturating_sub(energy_damage);
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
        Spell::WaterBurst => {
            if let Some(energy) = player.energy.checked_sub(15) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
    }

    TurnAction::CastSpell
}
