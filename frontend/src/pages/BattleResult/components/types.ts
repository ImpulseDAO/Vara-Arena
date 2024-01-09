/**
 * Battle Log
 */

export type CharacterState = {
  energy: number;
  hp: number;
  position: number;
};

export type AttackKind = "Quick" | "Precise" | "Heavy";

export const spellnames = [
  "fireball",
  "waterRestoration",
  "earthCatapult",
  "waterBurst",
  "fireWall",
  "fireHaste",
  "earthSmites",
  "earthSkin",
  "chillingTouch",
] as const;

type Spell = (typeof spellnames)[number];

type Action = {
  move?: {
    position: number;
  };
  attack?: {
    kind: AttackKind;
    result: {
      damage?: number;
      miss?: any;
    };
  };
  rest?: {
    energy: number;
  };
  castSpell: {
    result: {
      [key in Spell]: key extends "fireball" | "waterBurst"
        ? { damage: number }
        : key extends "waterRestoration"
        ? { heal: number }
        : key extends "earthCatapult"
        ? { damage: number; enemyPosition: number }
        : {};
    };
  };
  fireWall: {
    damage: number;
  };
  notEnoughEnergy: {};
  parry: {};
  guardbreak: {};
};

export type LogEntry = {
  action: Action;
  character: string;
};

export type BattleStep = {
  character1?: CharacterState | null;
  character2?: CharacterState | null;
  logs: LogEntry[];
};
