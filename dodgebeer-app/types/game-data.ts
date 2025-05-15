import { z } from "zod";

export const GameData = {
  GAME: "game",
};

export type GameStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";

export type PlayerActionType = "HIT" | "SAVE";

export interface PlayerAction {
  action: PlayerActionType;
  time: number;
}

export interface Round {
  team1_id: Record<string, PlayerAction[]>;
  team2_id: Record<string, PlayerAction[]>;
}

export interface GameData {
  status: GameStatus;
  team1_id: string;
  team2_id: string;
  round_counter: number;
  rounds: Round[];
}
