use gstd::collections::HashMap;
use gstd::prelude::*;

pub type Stack = u8;

#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub enum EffectKind {
    Spikes,
    Empower,
    Luck,
    Regeneration,
    Blind,
}

#[derive(Clone, Debug)]
struct Effect {
    kind: EffectKind,
    duration: Option<u8>,
    stack: Stack,
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

    pub fn add_effect(&mut self, kind: EffectKind, stack: Stack, duration: Option<u8>) {
        assert!(stack > 0);
        let effect = Effect {
            kind,
            stack,
            duration,
        };
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
    use crate::effects::{EffectKind, Effects};

    #[test]
    fn default_usage() {
        let mut effects = Effects::new();
        effects.add_effect(EffectKind::Empower, 2, Some(1));
        effects.update_effects();
        assert!(effects.get_effect(EffectKind::Empower) == 2);
    }
}
