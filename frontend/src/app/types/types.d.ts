/**
 * Character
 */

type Attributes = {
  strength: number;
  agility: number;
  vitality: number;
  stamina: number;
  intelligence: number;
};

type MagicElement = "fire" | "water" | "earth";

type Character = {
  id: string;
  level: number;
  name: string;
  owner: string;
  experience: number;
  attributes: Attributes;
  magicElement: MagicElement;
  lives_count: number;
  tier_rating: number;
  balance: number;
};

/**
 * Lobby
 */

type LobbyCapacity = 2 | 4 | 8;
