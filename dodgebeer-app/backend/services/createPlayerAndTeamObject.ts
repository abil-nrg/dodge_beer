// backend/services/createPlayerAndTeamObject.ts

// util
import {
  checkIfPlayerIsInTeam,
  checkIfTeamAndPlayerExists,
  checkIfTeamIdExists,
} from "@backend/utils/gameObjectExistsUtil";
// types
import { MainDataConfig, MainDataType } from "@/types/main-data";
import {
  CreatePlayerRequest,
  CreatePlayerResponse,
  DeletePlayerRequest,
  PlayerWithId,
} from "@/types/player";
import {
  ChangePlayerStatusInTeamRequest,
  ChangePlayerStatusInTeamResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  DeleteTeamRequest,
  DeleteTeamOrPlayerResponse,
} from "@/types/team";

/**
 * A generic wrapper type for mutation return values.
 * Each mutation must return updated main data and a typed response payload.
 *
 * @template ResponseType - The response type returned to the client
 */
export interface MutationReturn<ResponseType> {
  data: MainDataType;
  response: ResponseType;
}

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

type CreatePlayerReturnInterface = MutationReturn<CreatePlayerResponse>;
/**
 * Adds a new player to the data object.
 */
export function createPlayerObjectService({
  data,
  body,
}: CreatePlayerInterface) {
  data.player_count += 1;
  const playerKey = `${MainDataConfig.PLAYER}${data.player_count}`;
  console.log(body.player_photo);
  data.players[playerKey] = {
    name: body.player_name,
    photo: `${MainDataConfig.UPLOAD_FOLDER}/${body.player_photo || MainDataConfig.DEFAULT_PHOTO}`,
  };
  return {
    data: data,
    response: { player_key: playerKey },
  } as CreatePlayerReturnInterface;
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
type CreateTeamReturnInterface = MutationReturn<CreateTeamResponse>;
/**
 * Adds a new team to the data object.
 */
export function createTeamObjectService({ data, body }: CreateTeamInterface) {
  data.team_count += 1;
  const teamKey = `${MainDataConfig.TEAM}${data.team_count}`;
  data.teams[teamKey] = {
    team_name: body.team_name,
    players: [],
  };
  return {
    data: data,
    response: { team_key: teamKey },
  } as CreateTeamReturnInterface;
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

type ChangePlayerInTeamReturnInterface =
  MutationReturn<ChangePlayerStatusInTeamResponse>;
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

  if (checkIfPlayerIsInTeam(data, teamId, playerId)) {
    throw new Error("Trying to add player to team again ");
  }

  data.teams[teamId].players.push(playerId);
  return {
    data: data,
    response: { players: data.teams[teamId].players },
  } as ChangePlayerInTeamReturnInterface;
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

  return {
    data: data,
    response: { players: teamPlayers },
  } as ChangePlayerInTeamReturnInterface;
}

/**
 * -------------------------------------------------------------
 * DELETING TEAM AND PLAYER
 * -------------------------------------------------------------
 */

/**
 *  Delete Object Return Interface
 */
type DeleteTeamOrPlayerReturnInterface =
  MutationReturn<DeleteTeamOrPlayerResponse>;

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
  return {
    data,
    response: { isDeleted: true },
  } as DeleteTeamOrPlayerReturnInterface;
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

  return {
    data,
    response: { isDeleted: true },
  } as DeleteTeamOrPlayerReturnInterface;
}

/**
 *
 */
export function getAvailablePlayersService(data: MainDataType) {
  const result: Array<PlayerWithId> = [];
  const PLAYER_AVAILABLE = 0;
  const PLAYER_UNAVAILABLE = 1;
  const players = data.players;
  const teams = data.teams;

  // get every player to map
  const playersAvailabilityMap = new Map<string, number>();
  Object.entries(players).forEach((player) => {
    playersAvailabilityMap.set(player[0], PLAYER_AVAILABLE);
  });

  //find all players in team
  Object.entries(teams).forEach((team) => {
    const teamPlayers = team[1].players;
    for (const teamPlayer of teamPlayers) {
      playersAvailabilityMap.set(teamPlayer, PLAYER_UNAVAILABLE);
    }
  });

  // players that are in team are marked, so expand it
  playersAvailabilityMap.forEach((availability, player_id) => {
    if (availability === PLAYER_AVAILABLE) {
      result.push({ player_id: player_id, player: players[player_id] });
    }
  });

  return result;
}
