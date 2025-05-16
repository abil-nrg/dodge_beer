import { GameStatus } from "@/types/game-data";

export type CreateGameRequest = {
  team1: string;
  team2: string;
};

export type CreateGameResponse = {
  gameId: string;
};

//---

export type UpdateGameResponse = {
  status: GameStatus;
  round_counter: number;
  team1_id: string;
  team2_id: string;
  team1_side: string;
  team2_side: string;
};

// --
export interface PlayerStats {
  hits: number;
  misses: number;
  saves: number;
  attack_rounds: number;
  defence_rounds: number;
  player_done_round?: number;
}

export interface PlayerStatsWithInfo extends PlayerStats {
  player_id: string;
  player_name: string;
  team_name: string;
}
