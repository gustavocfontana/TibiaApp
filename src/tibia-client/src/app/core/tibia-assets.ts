const FANDOM = 'https://tibia.fandom.com/wiki/Special:FilePath';

export const tibiaSprite = (filename: string): string => `${FANDOM}/${filename}`;

const VOCATION_OUTFIT: Record<string, string> = {
  knight:   'Outfit_Knight_Male.gif',
  paladin:  'Outfit_Hunter_Male.gif',
  druid:    'Outfit_Summoner_Male.gif',
  sorcerer: 'Outfit_Mage_Male.gif',
  none:     'Outfit_Citizen_Male.gif'
};

export function vocationSprite(vocation: string | null | undefined): string {
  if (!vocation) return tibiaSprite(VOCATION_OUTFIT['none']);
  const v = vocation.toLowerCase();
  if (v.includes('knight')) return tibiaSprite(VOCATION_OUTFIT['knight']);
  if (v.includes('paladin')) return tibiaSprite(VOCATION_OUTFIT['paladin']);
  if (v.includes('druid')) return tibiaSprite(VOCATION_OUTFIT['druid']);
  if (v.includes('sorcerer')) return tibiaSprite(VOCATION_OUTFIT['sorcerer']);
  return tibiaSprite(VOCATION_OUTFIT['none']);
}

const WEAPON_SPRITE: Record<string, string> = {
  sword:     'Sword.gif',
  axe:       'Axe.gif',
  club:      'Club.gif',
  distance:  'Bow.gif',
  fist:      'Wooden_Shield.gif',
  shielding: 'Wooden_Shield.gif'
};

export function weaponSprite(kind: string): string {
  return tibiaSprite(WEAPON_SPRITE[kind] ?? 'Sword.gif');
}

const POTION_SPRITE: Record<string, string> = {
  'Mana Potion':          'Mana_Potion.gif',
  'Strong Mana Potion':   'Strong_Mana_Potion.gif',
  'Great Mana Potion':    'Great_Mana_Potion.gif',
  'Ultimate Mana Potion': 'Ultimate_Mana_Potion.gif'
};

export function potionSprite(name: string): string {
  return tibiaSprite(POTION_SPRITE[name] ?? 'Mana_Potion.gif');
}

export const spellGroupSprite = {
  attack:  tibiaSprite('Great_Fireball_Rune.gif'),
  healing: tibiaSprite('Life_Fluid.gif'),
  support: tibiaSprite('Spellbook.gif')
};

export const spellTypeSprite = {
  instant: tibiaSprite('Wand_of_Vortex.gif'),
  rune:    tibiaSprite('Blank_Rune.gif')
};
