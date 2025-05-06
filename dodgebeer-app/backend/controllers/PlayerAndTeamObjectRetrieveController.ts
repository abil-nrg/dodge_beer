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
  GetAllPlayersSchema,
  GetAllTeamsResponse,
  GetAllTeamsResponseSchema,
  GetPlayerByIdRequest,
  GetPlayerPhotoQueryRequest,
  GetPlayerPhotoResponse,
  OK_RESPONSE_JSON,
} from "@/types/api";
import { Player } from "@/types/player";

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
  const response = GetAllTeamsResponseSchema.parse(full_data);

  return new Response(
    JSON.stringify(response as GetAllTeamsResponse),
    OK_RESPONSE_JSON,
  );
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
  const response = GetAllPlayersSchema.parse(full_data);

  return new Response(
    JSON.stringify(response as GetAllPlayersResponse),
    OK_RESPONSE_JSON,
  );
}

export async function getPlayerByIdHandler({
  player_id,
}: GetPlayerByIdRequest) {
  const full_data = readMainDataFile();
  const players = GetAllPlayersSchema.parse(full_data).players;

  const playerRequested = players[player_id];
  if (!playerRequested) {
    return new Response(
      JSON.stringify({ error: `Player by id ${player_id} doesn't exist` }),
      BAD_REQUEST_JSON,
    );
  }
  return new Response(
    JSON.stringify(playerRequested as Player),
    OK_RESPONSE_JSON,
  );
}

/**
 * ----------------------------------------------------
 * PLAYER'S PHOTO
 * ----------------------------------------------------
 */

/**
 * Returns the photo URL for a specific player by ID.
 * If the player does not exist or has no photo, returns the default photo.
 *
 * @param player_id - The ID of the player to retrieve the photo for.
 * @returns JSON response with the player's photo URL.
 */
export async function getPlayerPhotoHandler({
  player_id,
}: GetPlayerPhotoQueryRequest) {
  const full_data = readMainDataFile();
  const data = GetAllPlayersSchema.parse(full_data).players;

  const player = data[player_id];
  const photo =
    player && player.photo ? player.photo : MainDataConfig.DEFAULT_PHOTO;

  return new Response(
    JSON.stringify({ photo } as GetPlayerPhotoResponse),
    OK_RESPONSE_JSON,
  );
}
