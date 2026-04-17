export interface SoulCoreItem {
  race: string;
  name: string;
  imageUrl: string;
  owned: boolean;
}

export interface SoulCoresResponse {
  items: SoulCoreItem[];
  total: number;
  owned: number;
  missing: number;
}

export interface ToggleResponse {
  creatureRace: string;
  owned: boolean;
}

export interface ImportResponse {
  imported: number;
}
