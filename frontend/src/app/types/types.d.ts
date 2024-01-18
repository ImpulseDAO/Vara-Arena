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

type AdditionalAttributes = {
  livesCount: number;
  tierRating: number;
  balance: number;
};

type MagicElement = "fire" | "water" | "earth";

type CharacterInContractState = {
  algorithmId: "0x8918c6e37881e0185b53a5af77cb072529a5b58060e79a3e111c9a1870a4324e";
  attributes: Attributes & AdditionalAttributes;
  experience: number;
  id: number;
  level: number;
  name: string;
};

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
