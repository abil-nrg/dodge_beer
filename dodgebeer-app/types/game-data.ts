export const GameConfig = {
  GAME: "game",
  TEAM1_KEY: "team1_id",
  TEAM2_KEY: "team2_id",
  ATTACK: "ATTACK",
  DEFENCE: "DEFENCE",
} as const;

export type TeamKeys = "team1_id" | "team2_id";

export type TeamSideInGame = "ATTACK" | "DEFENCE";

export type GameStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";

export type PlayerActionType = "HIT" | "SAVE";

export interface PlayerAction {
  action: PlayerActionType;
  time: number;
}

export interface TeamRoundData {
  side: TeamSideInGame;
  players: Record<string, PlayerAction[]>;
}

export interface Round {
  team1_id: TeamRoundData;
  team2_id: TeamRoundData;
  players_done: string[];
}

export interface GameData {
  status: GameStatus;
  team1_id: string;
  team2_id: string;
  rounds: Round[];
}

export const EmptyRound = {
  team1_id: {
    side: "ATTACK",
    players: {},
  },
  team2_id: {
    side: "DEFENCE",
    players: {},
  },
  players_done: [],
};
