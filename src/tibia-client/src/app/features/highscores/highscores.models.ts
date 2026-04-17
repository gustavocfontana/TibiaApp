export interface HighscoreEntry {
  rank: number;
  name: string;
  vocation: string;
  world: string;
  level: number;
  value: number;
}

export interface HighscoresResponse {
  entries: HighscoreEntry[];
  world: string;
  category: string;
  page: number;
}
