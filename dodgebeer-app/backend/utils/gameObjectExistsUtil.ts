import { MainDataType } from "@backend/config/config";

export function checkIfTeamAndPlayerExists(
  data: MainDataType,
  teamId: string,
  playerId: string,
) {
  const all_teams = data.teams;
  const all_players = data.players;
  return playerId in all_players && teamId in all_teams;
}

export function checkIfPlayerIsInTeam(
  data: MainDataType,
  teamId: string,
  playerId: string,
) {
  if (!checkIfTeamAndPlayerExists(data, teamId, playerId)) {
    return false;
  }

  const team = data.teams[teamId];
}

export function checkIfPlayerIdExists(
  data: MainDataType,
  playerId: string,
): boolean {
  const all_players = data.players;

  return playerId in all_players;
}

export function checkIfTeamIdExists(
  data: MainDataType,
  teamId: string,
): boolean {
  const all_teams = data.teams;
  return teamId in all_teams;
}
