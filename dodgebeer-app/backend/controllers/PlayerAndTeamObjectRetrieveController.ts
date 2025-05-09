// backend/controllers/PlayerAndTeamObjectRetrieveController.ts

// next
import { NextResponse } from "next/server";
// util
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "@backend/services/readFile";
// types
import { MainDataConfig, MainDataType } from "@/types/main-data";
import {
  ApiError,
  ApiResponse,
  ApiSuccess,
  HTTP_CODE,
  ResponseWithErrorInData,
} from "@/types/api";
import { GetAllTeamsResponse, GetAllTeamsResponseSchema } from "@/types/team";
import {
  GetAllPlayersResponse,
  GetAllPlayersResponseSchema,
  GetPlayerByIdRequest,
  GetPlayerByIdResponse,
} from "@/types/player";
import { ERROR_MESSAGE } from "@/types/message";

/**
 * ----------------------------------------------------
 * MAIN DATA
 * ----------------------------------------------------
 */

/**
 * Resets the main data file to its default empty state.
 *
 * @returns JSON response with the cleared main data.
 */
export function clearMainDataHandler() {
  overwriteFile(DATA_FILE, MainDataConfig.EMPTY_DATA_FILE);
  return getMainDataHandler();
}

/**
 * Retrieves the entire main data file content.
 *
 * @returns JSON response with the main data.
 */
export async function getMainDataHandler(): Promise<
  NextResponse<ApiResponse<MainDataType>>
> {
  const data = readMainDataFile();

  return ApiSuccess<MainDataType>(data);
}

/**
 * ----------------------------------------------------
 * TEAMS
 * ----------------------------------------------------
 */

/**
 * Retrieves and validates all team data from the main data file.
 *
 * @returns JSON response containing all teams.
 */
export async function getAllTeamsHandler(): Promise<
  NextResponse<ApiResponse<GetAllTeamsResponse>>
> {
  const full_data = readMainDataFile();
  const response: GetAllTeamsResponse =
    GetAllTeamsResponseSchema.parse(full_data);

  return ApiSuccess<GetAllTeamsResponse>(response);
}

/**
 * ----------------------------------------------------
 * PLAYERS
 * ----------------------------------------------------
 */

/**
 * Retrieves and validates all player data from the main data file.
 *
 * @returns JSON response containing all players.
 */
export async function getAllPlayersHandler(): Promise<
  NextResponse<ApiResponse<GetAllPlayersResponse>>
> {
  const full_data = readMainDataFile();
  const response: GetAllPlayersResponse =
    GetAllPlayersResponseSchema.parse(full_data);

  return ApiSuccess<GetAllPlayersResponse>(response);
}

export async function getPlayerByIdHandler({
  player_id,
}: GetPlayerByIdRequest): Promise<
  NextResponse<ApiResponse<GetPlayerByIdResponse | ResponseWithErrorInData>>
> {
  const full_data = readMainDataFile();
  const players = GetAllPlayersResponseSchema.parse(full_data).players;

  const playerRequested = players[player_id];
  if (!playerRequested) {
    return ApiError({
      status: HTTP_CODE.NOT_FOUND,
      message: ERROR_MESSAGE.PLAYER_DOESNT_EXIST(player_id),
    });
  }
  return ApiSuccess<GetPlayerByIdResponse>(playerRequested);
}
