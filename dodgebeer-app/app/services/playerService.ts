//  app/services/playerService.ts

// util
import { ApiClient } from "@/app/api/all-routes";
//types
import { ApiResponse, ResponseWithErrorInData } from "@/types/api";
import {
  GetAllPlayersResponse,
  GetPlayerByIdResponse,
  GetPlayerNotInTeamResponse,
} from "@/types/player";
import { normalizeApiResponse } from "@/app/util/readAndNormalizeApiResponseType";
import { MainDataConfig, Player } from "@/types/main-data";

/** Fetch all player data for given IDs. Returns a map of ID → Player.
 *  Falls back to placeholder player if individual requests fail.
 *
 *  @param ids - List of player IDs
 *  @returns Record of playerId to Player object
 */
//-----------------------------------------------------------------------------//
export async function getPlayersMapFromIds(
  ids: string[],
): Promise<Record<string, Player>> {
  const players: Record<string, Player> = {};

  await Promise.all(
    ids.map(async (id) => {
      try {
        players[id] = await fetchPlayerInfoById(id);
      } catch {
        players[id] = {
          name: id,
          photo: MainDataConfig.DEFAULT_PHOTO,
        };
      }
    }),
  );

  return players;
}

//-----------------------------------------------------------------------------//
/** Fetch individual player data by ID with schema validation.
 *
 *  @param player_id - Unique player identifier
 *  @returns Validated Player object
 *  @throws If fetch or schema validation fails
 */
//-----------------------------------------------------------------------------//
export async function fetchPlayerInfoById(player_id: string) {
  const response = await ApiClient.GetPLayerById(player_id);
  const result = (await response.json()) as ApiResponse<
    GetPlayerByIdResponse | ResponseWithErrorInData
  >;

  const normalized = normalizeApiResponse<
    GetPlayerByIdResponse,
    ResponseWithErrorInData
  >(result);

  if (response.status !== 200 || !normalized.ok || !normalized.data) {
    console.error(`Caught error in fetchPlayerInfoById\n
                   Player with Id ${player_id}.\n
                   Error: ${normalized.errMsg ?? "Unknown error"}`);
    throw new Error();
  }

  return normalized.data;
}

//-----------------------------------------------------------------------------//
/**
 * Fetch all players who are not currently assigned to any team.
 *
 * @returns An array of PlayerWithId objects
 */
//-----------------------------------------------------------------------------//
export async function fetchAllAvailablePlayers() {
  const response = await ApiClient.getPlayersNotInTeam();
  const result =
    (await response.json()) as ApiResponse<GetPlayerNotInTeamResponse>;

  return result.data;
}

//-----------------------------------------------------------------------------//
/**
 * Fetch all players
 *
 * @returns
 */
//-----------------------------------------------------------------------------//
export async function fetchAllPlayers() {
  const response = await ApiClient.getAllPlayers();
  const result = (await response.json()) as ApiResponse<GetAllPlayersResponse>;

  return result.data;
}

//-----------------------------------------------------------------------------//
/**
 * Deletes player by id
 *
 * @returns
 */
//-----------------------------------------------------------------------------//
export async function deletePlayerById(id: string) {
  ApiClient.deletePlayer(id);
}
