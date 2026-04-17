export interface KillEntry {
  race: string;
  lastDayKilled: number;
  lastDayPlayersKilled: number;
  lastWeekKilled: number;
  lastWeekPlayersKilled: number;
}

export interface KillStatisticsResponse {
  world: string;
  entries: KillEntry[];
}
