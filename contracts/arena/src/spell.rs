use arena_io::{Character, Spell, TurnAction};

pub fn execute_cast_spell(
    player: &mut Character,
    enemy: &mut Character,
    spell: &Spell,
) -> TurnAction {
    match spell {
        Spell::Fireball => {
            if let Some(energy) = player.energy.checked_sub(15) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::EarthCatapult => {
            if let Some(energy) = player.energy.checked_sub(15) {
                player.energy = energy;
                let energy_damage = 10 + player.attributes.intelligence * 2;
                enemy.energy = enemy.energy.saturating_sub(energy_damage);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::WaterBurst => {
            if let Some(energy) = player.energy.checked_sub(15) {
                player.energy = energy;
                let damage = 5 + player.attributes.intelligence * 2;
                enemy.lower_hit_chance = true;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::WaterRestoration => {
            if let Some(energy) = player.energy.checked_sub(15) {
                player.energy = energy;
                let heal = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(heal);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
    }

    TurnAction::CastSpell
}
