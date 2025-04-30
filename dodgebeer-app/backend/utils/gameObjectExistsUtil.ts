// backend/utils/gameObjectExistsUtil.ts

import { MainDataType } from "@/types/main-data";

/**
 * Checks whether a player exists and is assigned to a specific team.
 *
 * @param data - The main data object containing teams and players.
 * @param teamId - The ID of the team to check.
 * @param playerId - The ID of the player to check.
 * @returns `true` if the player exists and is part of the specified team, otherwise `false`.
 */
export function checkIfPlayerIsInTeam(
  data: MainDataType,
  teamId: string,
  playerId: string,
): boolean {
  if (!checkIfTeamAndPlayerExists(data, teamId, playerId)) {
    return false;
  }

  const team = data.teams[teamId];
  return team.players.includes(playerId);
}

/**
 * Checks whether both a player and a team exist in the data.
 *
 * @param data - The main data object containing teams and players.
 * @param teamId - The ID of the team to verify.
 * @param playerId - The ID of the player to verify.
 * @returns `true` if both the team and player exist, otherwise `false`.
 */
export function checkIfTeamAndPlayerExists(
  data: MainDataType,
  teamId: string,
  playerId: string,
): boolean {
  const all_teams = data.teams;
  const all_players = data.players;
  return playerId in all_players && teamId in all_teams;
}

/**
 * Checks whether a player exists in the data.
 *
 * @param data - The main data object containing players.
 * @param playerId - The ID of the player to verify.
 * @returns `true` if the player exists, otherwise `false`.
 */
export function checkIfPlayerIdExists(
  data: MainDataType,
  playerId: string,
): boolean {
  const all_players = data.players;
  return playerId in all_players;
}

/**
 * Checks whether a team exists in the data.
 *
 * @param data - The main data object containing teams.
 * @param teamId - The ID of the team to verify.
 * @returns `true` if the team exists, otherwise `false`.
 */
export function checkIfTeamIdExists(
  data: MainDataType,
  teamId: string,
): boolean {
  const all_teams = data.teams;
  return teamId in all_teams;
}
