export type CreateGameRequest = {
  team1: string;
  team2: string;
};

export type CreateGameResponse = {
  gameId: string;
};

//---

export type UpdateGameResponse = {
  round_counter: number;
  team1_id: string;
  team2_id: string;
  team1_side: string;
  team2_side: string;
};
