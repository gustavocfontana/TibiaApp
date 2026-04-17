export type Vocation = 'knight' | 'paladin' | 'druid' | 'sorcerer';
export type WeaponSkill = 'sword' | 'axe' | 'club' | 'distance' | 'fist';
export type SkillKind = WeaponSkill | 'shielding';

export const VOCATIONS: { value: Vocation; label: string }[] = [
  { value: 'knight', label: 'Knight' },
  { value: 'paladin', label: 'Paladin' },
  { value: 'druid', label: 'Druid' },
  { value: 'sorcerer', label: 'Sorcerer' }
];

export const SKILL_KINDS: { value: SkillKind; label: string }[] = [
  { value: 'sword', label: 'Sword' },
  { value: 'axe', label: 'Axe' },
  { value: 'club', label: 'Club' },
  { value: 'distance', label: 'Distance' },
  { value: 'fist', label: 'Fist' },
  { value: 'shielding', label: 'Shielding' }
];

export function experienceForLevel(level: number): number {
  if (level < 1) return 0;
  return Math.round((50 / 3) * level ** 3 - 100 * level ** 2 + (850 / 3) * level - 200);
}

export function experienceBetween(from: number, to: number): number {
  return Math.max(0, experienceForLevel(to) - experienceForLevel(from));
}

export function hoursToLevel(from: number, to: number, expPerHour: number): number {
  if (expPerHour <= 0) return 0;
  return experienceBetween(from, to) / expPerHour;
}

interface SkillFactor { a: number; c: number; }

const MELEE_FACTOR: Record<Vocation, SkillFactor> = {
  knight:    { a: 50, c: 1.1 },
  paladin:   { a: 50, c: 1.2 },
  druid:     { a: 50, c: 2.0 },
  sorcerer:  { a: 50, c: 2.0 }
};

const DISTANCE_FACTOR: Record<Vocation, SkillFactor> = {
  knight:    { a: 25, c: 2.0 },
  paladin:   { a: 25, c: 1.1 },
  druid:     { a: 25, c: 2.0 },
  sorcerer:  { a: 25, c: 2.0 }
};

const SHIELDING_FACTOR: Record<Vocation, SkillFactor> = {
  knight:    { a: 100, c: 1.1 },
  paladin:   { a: 100, c: 1.1 },
  druid:     { a: 100, c: 1.5 },
  sorcerer:  { a: 100, c: 1.5 }
};

const FIST_FACTOR: Record<Vocation, SkillFactor> = {
  knight:    { a: 50, c: 1.5 },
  paladin:   { a: 50, c: 1.5 },
  druid:     { a: 50, c: 1.5 },
  sorcerer:  { a: 50, c: 1.5 }
};

const MAGIC_FACTOR: Record<Vocation, SkillFactor> = {
  knight:    { a: 4000, c: 1.1 },
  paladin:   { a: 2000, c: 1.1 },
  druid:     { a: 1600, c: 1.1 },
  sorcerer:  { a: 1600, c: 1.1 }
};

function skillFactor(vocation: Vocation, kind: SkillKind): SkillFactor {
  if (kind === 'distance') return DISTANCE_FACTOR[vocation];
  if (kind === 'shielding') return SHIELDING_FACTOR[vocation];
  if (kind === 'fist') return FIST_FACTOR[vocation];
  return MELEE_FACTOR[vocation];
}

export function hitsNeeded(
  vocation: Vocation,
  kind: SkillKind,
  current: number,
  target: number,
  loyaltyPercent = 0
): number {
  if (target <= current) return 0;
  const { a, c } = skillFactor(vocation, kind);
  const base = a * (Math.pow(c, target - 10) - Math.pow(c, current - 10)) / (c - 1);
  const reduced = base * (1 - loyaltyPercent / 100);
  return Math.max(0, Math.ceil(reduced));
}

export function manaForMagicLevel(
  vocation: Vocation,
  current: number,
  target: number,
  loyaltyPercent = 0
): number {
  if (target <= current) return 0;
  const { a, c } = MAGIC_FACTOR[vocation];
  const base = a * (Math.pow(c, target) - Math.pow(c, current)) / (c - 1);
  const reduced = base * (1 - loyaltyPercent / 100);
  return Math.max(0, Math.ceil(reduced));
}

export interface PotionCost { name: string; mana: number; gold: number; }

export const POTIONS: PotionCost[] = [
  { name: 'Mana Potion',          mana: 100, gold: 50 },
  { name: 'Strong Mana Potion',   mana: 160, gold: 80 },
  { name: 'Great Mana Potion',    mana: 250, gold: 120 },
  { name: 'Ultimate Mana Potion', mana: 425, gold: 190 }
];

export interface PotionsBreakdown { potion: PotionCost; count: number; cost: number; }

export function breakdownPotions(totalMana: number): PotionsBreakdown[] {
  return POTIONS.map(potion => {
    const count = Math.ceil(totalMana / potion.mana);
    return { potion, count, cost: count * potion.gold };
  });
}
