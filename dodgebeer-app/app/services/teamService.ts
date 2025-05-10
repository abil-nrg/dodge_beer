import { ApiClient } from "@/app/api/all-routes";
import { ApiResponse, ResponseWithErrorInData } from "@/types/api";
import { GetPlayerByIdResponse } from "@/types/player";
import { MainDataConfig, Player } from "@/types/main-data";
import {
  ChangePlayerStatusInTeamResponse,
  ChangePlayerStatusInTeamResponseSchema,
  DeleteTeamOrPlayerResponse,
} from "@/types/team";
import { normalizeApiResponse } from "@/app/util/readAndNormalizeApiResponseType";

//-----------------------------------------------------------------------------//
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
/** Remove a player from a team and return updated player list or error string.
 *
 *  @param playerId - Player ID to remove
 *  @param teamId - Team ID to remove player from
 *  @returns Updated list of player IDs or error message
 */
//-----------------------------------------------------------------------------//
export async function removePlayerFromTeam(
  playerId: string,
  teamId: string,
): Promise<string[] | string | undefined> {
  const response = await ApiClient.removePlayerFromTeam(playerId, teamId);
  const result: ApiResponse<
    ChangePlayerStatusInTeamResponse | ResponseWithErrorInData
  > = await response.json();

  const schemaValidation = ChangePlayerStatusInTeamResponseSchema.safeParse(
    result.data,
  );

  if (schemaValidation.success) {
    return schemaValidation.data.players;
  }

  if ("error" in result.data) {
    return result.data.error;
  }
}

//-----------------------------------------------------------------------------//
/** Delete a team by ID. Returns true on success, or error string on failure.
 *
 *  @param teamId - Team ID to delete
 *  @returns true if successful, otherwise an error message string
 */
//-----------------------------------------------------------------------------//
export async function deleteTeamService(
  teamId: string,
): Promise<true | string> {
  try {
    const res = await ApiClient.deleteTeam(teamId);
    const json: ApiResponse<
      DeleteTeamOrPlayerResponse | ResponseWithErrorInData
    > = await res.json();

    const normalized = normalizeApiResponse<
      DeleteTeamOrPlayerResponse,
      ResponseWithErrorInData
    >(json);

    if (res.status !== 200 || !normalized.ok) {
      return normalized.errMsg ?? "Unknown error while deleting team.";
    }

    return true;
  } catch {
    return "Unexpected error while deleting team.";
  }
}
