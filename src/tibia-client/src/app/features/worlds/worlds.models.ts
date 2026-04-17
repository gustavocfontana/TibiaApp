export interface World {
  name: string;
  status: string;
  playersOnline: number;
  location: string;
  pvpType: string;
  battleyeProtected: boolean;
  battleyeDate: string;
  transferType: string;
}

export interface WorldsResponse {
  worlds: World[];
  playersOnline: number;
  recordPlayers: number;
}
