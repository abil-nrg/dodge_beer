import { CreateGameRequest, CreateGameResponse } from "@/types/game-api";
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "@backend/services/readFile";
import { createGameObjectService } from "@backend/services/createGameObject";
import { ApiSuccess } from "@/types/api";

export async function createGameHandler(body: CreateGameRequest) {
  const mainData = readMainDataFile();
  const game_num = mainData.game_count + 1;
  mainData.game_count = game_num;
  // create game file
  const gameFileName = createGameObjectService({
    game_num,
    team1: body.team1,
    team2: body.team2,
  });
  //overwrite main data
  overwriteFile(DATA_FILE, mainData);
  // return response
  const response = { gameId: gameFileName } as CreateGameResponse;
  return ApiSuccess<CreateGameResponse>(response, 201);
}
