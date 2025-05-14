// util
import { ApiClient } from "@/app/api/all-routes";
// types
import { ApiResponse, ResponseWithErrorInData } from "@/types/api";
import {
  ChangePlayerStatusInTeamResponse,
  ChangePlayerStatusInTeamResponseSchema,
  CreateTeamResponse,
  DeleteTeamOrPlayerResponse,
} from "@/types/team";
import { normalizeApiResponse } from "@/app/util/readAndNormalizeApiResponseType";

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
  const response = await ApiClient.removePlayerFromTeamRoute(playerId, teamId);
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

/**
 * Sends a request to add a player to a team.
 *
 * @param teamId - ID of the team to add the player to
 * @param playerId - ID of the player to add
 * @returns The parsed API response or an error message
 */
export function addNewPlayerToTeam(teamId: string, playerId: string) {
  ApiClient.addNewPlayerToTeamRoute(teamId, playerId);
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
    const res = await ApiClient.deleteTeamRoute(teamId);
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

/**
 * Calls backend to create new team
 * @param teamName - Team name
 */
export async function createTeam(teamName: string) {
  const response = await ApiClient.createTeamRoute(teamName);
  const result = (await response.json()) as CreateTeamResponse;
  return result.team_key;
}
