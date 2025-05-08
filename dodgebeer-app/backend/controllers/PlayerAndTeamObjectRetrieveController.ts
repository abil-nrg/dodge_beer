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
import { MainDataConfig } from "@/types/main-data";
import {
  BAD_REQUEST_JSON,
  GetAllPlayersResponse,
  GetAllPlayersResponseSchema,
  GetAllTeamsResponse,
  GetAllTeamsResponseSchema,
  GetPlayerByIdRequest,
  GetPlayerByIdResponse,
  OK_RESPONSE_JSON,
} from "@/types/api";

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
export async function getMainDataHandler() {
  const data = readMainDataFile();

  return new Response(JSON.stringify(data), OK_RESPONSE_JSON);
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
export async function getAllTeamsHandler() {
  const full_data = readMainDataFile();
  const response: GetAllTeamsResponse =
    GetAllTeamsResponseSchema.parse(full_data);

  return new Response(JSON.stringify(response), OK_RESPONSE_JSON);
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
export async function getAllPlayersHandler() {
  const full_data = readMainDataFile();
  const response: GetAllPlayersResponse =
    GetAllPlayersResponseSchema.parse(full_data);

  return new Response(JSON.stringify(response), OK_RESPONSE_JSON);
}

export async function getPlayerByIdHandler({
  player_id,
}: GetPlayerByIdRequest) {
  const full_data = readMainDataFile();
  const players = GetAllPlayersResponseSchema.parse(full_data).players;

  const playerRequested: GetPlayerByIdResponse | null = players[player_id];
  if (!playerRequested) {
    return new Response(
      JSON.stringify({ error: `Player by id ${player_id} doesn't exist` }),
      BAD_REQUEST_JSON,
    );
  }
  return new Response(JSON.stringify(playerRequested), OK_RESPONSE_JSON);
}
