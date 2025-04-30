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
  GetAllPlayersResponse,
  GetAllPlayersSchema,
  GetAllTeamsResponse,
  GetAllTeamsResponseSchema,
  GetPlayerPhotoQueryRequest,
  GetPlayerPhotoResponse,
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
export function clearMainData() {
  overwriteFile(DATA_FILE, MainDataConfig.EMPTY_DATA_FILE);
  return getMainData();
}

/**
 * Retrieves the entire main data file content.
 *
 * @returns JSON response with the main data.
 */
export async function getMainData() {
  const data = readMainDataFile();

  return NextResponse.json({ status: 200, data: data });
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

  return NextResponse.json({
    status: 200,
    data: response as GetAllTeamsResponse,
  });
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

  return NextResponse.json({
    status: 200,
    data: response as GetAllPlayersResponse,
  });
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

  return NextResponse.json({
    status: 200,
    data: { photo: photo } as GetPlayerPhotoResponse,
  });
}
