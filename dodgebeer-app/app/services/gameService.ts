import { ApiClient } from "@/app/api/all-routes";
import { CreateGameResponse } from "@/types/game-api";
import { ApiResponse } from "@/types/api";

export async function createNewGameService(team1: string, team2: string) {
  const response = await ApiClient.createGameRoute(team1, team2);
  const data = (await response.json()) as ApiResponse<CreateGameResponse>;
  const gameId = data.data.gameId;

  if (response.status !== 201 || !data.success || !gameId) {
    throw new Error("Could not create game");
  }

  return gameId;
}
