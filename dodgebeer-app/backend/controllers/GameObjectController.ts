import {
  CreateGameRequest,
  CreateGameResponse,
  UpdateGameResponse,
} from "@/types/game-api";
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "@backend/services/readFile";
import {
  createGameObjectService,
  overWriteGameFile,
} from "@backend/services/createGameObject";
import { ApiSuccess } from "@/types/api";
import { GetBothTeamsResponse } from "@/types/team";
import { getTeamAndPlayersByGameId } from "@backend/services/gameUtil";
import {
  getGameState,
  handleHit,
  handleSave,
} from "@backend/services/gameLogic";
import { Mutex } from "async-mutex";
import { getGameLock } from "@backend/lock/GameLock";

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

export async function getTeamInfoForGameHandler(gameId: string) {
  const body = getTeamAndPlayersByGameId(gameId);
  return ApiSuccess<GetBothTeamsResponse>(body);
}

export async function gameHitClickedHandler(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  const mutex = getGameLock(gameId);
  await mutex.runExclusive(async () => {
    const game = handleHit(gameId, teamId, playerId, time);
    await overWriteGameFile(gameId, game);
  });
  return ApiSuccess<null>(null);
}

export async function gameSaveClickedHandler(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  const mutex = getGameLock(gameId);
  await mutex.runExclusive(async () => {
    const game = handleSave(gameId, teamId, playerId, time);
    await overWriteGameFile(gameId, game);
  });
  return ApiSuccess<null>(null);
}

export async function getGameStatusHandler(gameId: string) {
  try {
    const gameState = getGameState(gameId);
    return ApiSuccess<UpdateGameResponse>(gameState);
  } catch (error) {
    console.error("Error!\n", error);
    return ApiSuccess<null>(null);
  }
}
