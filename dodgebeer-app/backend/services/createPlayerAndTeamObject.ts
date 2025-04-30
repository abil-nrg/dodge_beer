import {
  checkIfTeamAndPlayerExists,
  checkIfTeamIdExists,
} from "@backend/utils/gameObjectExistsUtil";
import { MainDataConfig, MainDataType } from "@/types/main-data";
import {
  CreatePlayerRequest,
  DeletePlayerRequest,
  Player,
} from "@/types/player";
import {
  ChangePlayerStatusInTeamRequest,
  CreateTeamRequest,
  DeleteTeamRequest,
  Team,
} from "@/types/team";

interface CreatePlayerInterface {
  data: MainDataType;
  body: CreatePlayerRequest;
}
export function createPlayerObjectService({
  data,
  body,
}: CreatePlayerInterface) {
  data.player_count += 1;
  const playerKey = `${MainDataConfig.PLAYER}${data.player_count}`;
  data.players[playerKey] = {
    name: body.player_name,
    photo: body.player_photo || MainDataConfig.DEFAULT_PHOTO,
  } as Player;
  return data;
}

interface CreateTeamInterface {
  data: MainDataType;
  body: CreateTeamRequest;
}
export function createTeamObject({ data, body }: CreateTeamInterface) {
  data.team_count += 1;
  const teamKey = `${MainDataConfig.TEAM}${data.team_count}`;
  data.teams[teamKey] = {
    team_name: body.team_name,
    players: [],
  } as Team;
  return data;
}

interface ChangePlayerInTeamInterface {
  data: MainDataType;
  body: ChangePlayerStatusInTeamRequest;
}

export function addPlayerToTeamService({
  data,
  body,
}: ChangePlayerInTeamInterface) {
  const teamId = body.team_id;
  const playerId = body.player_id;
  //  need to verify that player and team exists
  if (!checkIfTeamAndPlayerExists(data, teamId, playerId)) {
    throw new Error("Team or Player don't exist in file");
  }

  data.teams[teamId].players.push(playerId);
  return data;
}

export function removePlayerFromTeamService({
  data,
  body,
}: ChangePlayerInTeamInterface) {
  const teamId = body.team_id;
  const playerId = body.player_id;
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
  body: DeleteTeamRequest;
}

export function deleteTeamService({ data, body }: DeleteTeam) {
  delete data.teams[body.team_id];
  return data;
}

interface DeletePlayer {
  data: MainDataType;
  body: DeletePlayerRequest;
}

export function deletePlayerService({ data, body }: DeletePlayer) {
  delete data.players[body.player_id];
  // we also need to go through every team and delete player id there
  const teams = data.teams;
  for (const team of Object.values(teams)) {
    const index = team.players.indexOf(body.player_id);
    if (index > -1) {
      team.players.splice(index, 1);
      break;
    }
  }
  return data;
}
