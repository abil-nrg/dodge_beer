import Config, { MainDataType, Player, Team } from "../config/config";
import {
  checkIfTeamAndPlayerExists,
  checkIfTeamIdExists,
} from "@backend/utils/gameObjectExistsUtil";

interface CreatePlayerInterface {
  data: MainDataType;
  playerName: string;
  playerPhoto?: string;
}
export function createPlayerObject({
  data,
  playerName,
  playerPhoto,
}: CreatePlayerInterface) {
  data.player_count += 1;
  const playerKey = `${Config.PLAYER}${data.player_count}`;
  data.players[playerKey] = {
    name: playerName,
    photo: playerPhoto || Config.DEFAULT_PHOTO,
  } as Player;
  return data;
}

interface CreateTeamInterface {
  data: MainDataType;
  teamName: string;
}
export function createTeamObject({ data, teamName }: CreateTeamInterface) {
  data.team_count += 1;
  const teamKey = `${Config.TEAM}${data.team_count}`;
  data.teams[teamKey] = {
    team_name: teamName,
    players: [],
  } as Team;
  return data;
}

interface ChangePlayerInTeamInterface {
  data: MainDataType;
  teamId: string;
  playerId: string;
}

export function addPlayerToTeam({
  data,
  teamId,
  playerId,
}: ChangePlayerInTeamInterface) {
  //  need to verify that player and team exists
  if (!checkIfTeamAndPlayerExists(data, teamId, playerId)) {
    throw new Error("Team or Player don't exist in file");
  }

  data.teams[teamId].players.push(playerId);
  return data;
}

export function removePlayerFromTeam({
  data,
  teamId,
  playerId,
}: ChangePlayerInTeamInterface) {
  //  need to verify that player and team exists
  if (!checkIfTeamIdExists(data, teamId)) {
    throw new Error("Team or Player don't exist in file");
  }
  const teamPlayers = data.teams[teamId].players;

  const index = teamPlayers.findIndex((player_id) => player_id == playerId);
  if (index > -1) teamPlayers.splice(index, 1);
  return data;
}

interface DeleteTeam {
  data: MainDataType;
  teamId: string;
}

export function deleteTeamService({ data, teamId }: DeleteTeam) {
  delete data.teams[teamId];
  return data;
}

interface DeletePlayer {
  data: MainDataType;
  playerId: string;
}

export function deletePlayerService({ data, playerId }: DeletePlayer) {
  delete data.players[playerId];
  // we also need to go through every team and delete player id there
  const teams = data.teams;
  for (const team of Object.values(teams)) {
    const index = team.players.indexOf(playerId);
    if (index > -1) {
      team.players.splice(index, 1);
      break;
    }
  }
  return data;
}
