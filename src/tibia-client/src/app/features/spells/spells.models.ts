export interface Spell {
  name: string;
  spellId: string;
  formula: string;
  level: number;
  mana: number;
  groupAttack: boolean;
  groupHealing: boolean;
  groupSupport: boolean;
  typeInstant: boolean;
  typeRune: boolean;
  premiumOnly: boolean;
}

export interface SpellsResponse {
  spells: Spell[];
  total: number;
}
