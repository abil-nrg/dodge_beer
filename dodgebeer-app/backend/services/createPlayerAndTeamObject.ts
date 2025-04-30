// backend/services/createPlayerAndTeamObject.ts

// util
import {
  checkIfTeamAndPlayerExists,
  checkIfTeamIdExists,
} from "@backend/utils/gameObjectExistsUtil";
// types
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

/**
 * -------------------------------------------------------------
 * CREATING PLAYER
 * -------------------------------------------------------------
 */

/**
 * Interface for creating a new player object.
 */
interface CreatePlayerInterface {
  data: MainDataType;
  body: CreatePlayerRequest;
}

/**
 * Adds a new player to the data object.
 */
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

/**
 * -------------------------------------------------------------
 * CREATING TEAM
 * -------------------------------------------------------------
 */

/**
 * Interface for creating a new team.
 */
interface CreateTeamInterface {
  data: MainDataType;
  body: CreateTeamRequest;
}

/**
 * Adds a new team to the data object.
 */
export function createTeamObjectService({ data, body }: CreateTeamInterface) {
  data.team_count += 1;
  const teamKey = `${MainDataConfig.TEAM}${data.team_count}`;
  data.teams[teamKey] = {
    team_name: body.team_name,
    players: [],
  } as Team;
  return data;
}

/**
 * -------------------------------------------------------------
 * CHANGING PLAYER STATUS IN TEAM (adding or removing)
 * -------------------------------------------------------------
 */

/**
 * Interface for changing a player's status in a team (add/remove).
 */
interface ChangePlayerInTeamInterface {
  data: MainDataType;
  body: ChangePlayerStatusInTeamRequest;
}

/**
 * Adds a player to a team.
 * Throws an error if the team or player does not exist.
 */
export function addPlayerToTeamService({
  data,
  body,
}: ChangePlayerInTeamInterface) {
  const teamId = body.team_id;
  const playerId = body.player_id;

  if (!checkIfTeamAndPlayerExists(data, teamId, playerId)) {
    throw new Error("Team or Player don't exist in file");
  }

  data.teams[teamId].players.push(playerId);
  return data;
}

/**
 * Removes a player from a team.
 * Throws an error if the team does not exist.
 */
export function removePlayerFromTeamService({
  data,
  body,
}: ChangePlayerInTeamInterface) {
  const teamId = body.team_id;
  const playerId = body.player_id;

  if (!checkIfTeamIdExists(data, teamId)) {
    throw new Error("Team or Player don't exist in file");
  }

  const teamPlayers = data.teams[teamId].players;
  const index = teamPlayers.findIndex((player_id) => player_id == playerId);
  if (index > -1) teamPlayers.splice(index, 1);

  return data;
}

/**
 * -------------------------------------------------------------
 * DELETING TEAM AND PLAYER
 * -------------------------------------------------------------
 */

/**
 * Interface for deleting a team.
 */
interface DeleteTeamInterface {
  data: MainDataType;
  body: DeleteTeamRequest;
}

/**
 * Deletes a team from the data object.
 */
export function deleteTeamService({ data, body }: DeleteTeamInterface) {
  delete data.teams[body.team_id];
  return data;
}

/**
 * Interface for deleting a player.
 */
interface DeletePlayerInterface {
  data: MainDataType;
  body: DeletePlayerRequest;
}

/**
 * Deletes a player and removes them from any team they belong to.
 */
export function deletePlayerService({ data, body }: DeletePlayerInterface) {
  delete data.players[body.player_id];

  // Remove the player from any team they are in
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
