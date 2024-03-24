use crate::effect::Effect;
use gstd::collections::HashMap;
use gstd::prelude::*;

#[derive(Clone, Debug, PartialEq)]
pub enum ItemTrigger {
    StartOfTurn,
    EndOfTurn,
    OnAttack,
    OnHit,
}

#[derive(Clone, Debug)]
pub struct Item {
    pub name: String,
    pub effects: Vec<Effect>,
    pub trigger: ItemTrigger,
}

pub struct ItemStorage {
    storage: HashMap<String, Item>,
}

impl ItemStorage {
    pub fn new() -> ItemStorage {
        ItemStorage {
            storage: HashMap::new(),
        }
    }

    pub fn add_item(&mut self, item: Item) {
        self.storage.insert(item.name.clone(), item);
    }

    pub fn get_items(&self, items: &Vec<String>) -> Vec<Item> {
        let mut found = Vec::with_capacity(items.len());
        for name in items {
            if let Some(item) = self.storage.get(name) {
                found.push(item.clone());
            }
        }
        found
    }
}
