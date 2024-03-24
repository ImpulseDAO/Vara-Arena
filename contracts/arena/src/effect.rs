use gstd::collections::HashMap;
use gstd::prelude::*;

pub type Stack = u8;

#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub enum EffectKind {
    Spikes,
    Empower,
    Luck,
    Regeneration,
    Vampirism,
    Blind,
}

#[derive(Clone, Debug)]
pub struct Effect {
    pub kind: EffectKind,
    pub duration: Option<u8>,
    pub stack: Stack,
}

#[derive(Clone, Debug)]
pub struct Effects {
    effects: Vec<Effect>,
    stacks: HashMap<EffectKind, Stack>,
}

impl Effects {
    pub fn new() -> Effects {
        Effects {
            effects: vec![],
            stacks: HashMap::new(),
        }
    }

    pub fn get_effect(&self, kind: EffectKind) -> Stack {
        *self.stacks.get(&kind).unwrap_or(&0)
    }

    pub fn add_effect(&mut self, effect: Effect) {
        assert!(effect.stack > 0);
        self.effects.push(effect);
    }

    /// Recalculate stacks before next turn
    pub fn update_effects(&mut self) {
        self.stacks.clear();

        self.effects.retain_mut(|effect| {
            if let Some(ref mut duration) = effect.duration {
                if *duration == 0 {
                    return false;
                }
                *duration -= 1;
            }

            self.stacks
                .entry(effect.kind.clone())
                .and_modify(|s| *s = s.saturating_add(effect.stack))
                .or_insert(effect.stack);
            return true;
        });
    }
}

#[cfg(test)]
mod tests {
    use crate::effect::{Effect, EffectKind, Effects};

    #[test]
    fn default_usage() {
        let mut effects = Effects::new();
        let effect = Effect {
            kind: EffectKind::Empower,
            duration: Some(1),
            stack: 2,
        };
        effects.add_effect(effect);
        effects.update_effects();
        assert!(effects.get_effect(EffectKind::Empower) == 2);
    }
}
