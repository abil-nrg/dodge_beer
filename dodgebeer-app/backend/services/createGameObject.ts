import Config, { MAIN_DATA_FILE_TYPE, Player } from "../config/config";

interface CreatePlayerInterface {
  data: MAIN_DATA_FILE_TYPE;
  playerName: string;
  playerPhoto?: string;
}
export function createPlayerObject({
  data,
  playerName,
  playerPhoto,
}: CreatePlayerInterface) {
  data.player_count += 1;
  const playerKey = `${Config.PLAYER_KEY}${data.player_count}`;
  data.players[playerKey] = {
    name: playerName,
    photo: playerPhoto || Config.DEFAULT_PHOTO,
  } as Player;

  return data;
}

interface CreateTeamInterface {
  data: MAIN_DATA_FILE_TYPE;
  teamName: string;
}
export function createTeamObject({ data, teamName }: CreateTeamInterface) {
  data.team_count += 1;
  const teamKey = `${Config.TEAM_KEY}${data.team_count}`;
  data.teams[teamKey] = {
    team_name: teamName,
    players: [],
  };
  return data;
}

interface ChangePlayerInTeamInterface {
  data: MAIN_DATA_FILE_TYPE;
  teamId: string;
  playerId: string;
}

function addPlayerToTeam({
  data,
  teamId,
  playerId,
}: ChangePlayerInTeamInterface) {
  const player: Player = data.players[playerId];
  data.teams[teamId].players.push(player);
  return data;
}

function removePlayerFromTeam({
  data,
  teamId,
  playerId,
}: ChangePlayerInTeamInterface) {
  const teamPlayers = data.teams[teamId].players;
  const index = teamPlayers.findIndex((p) => p.player_id === playerId);
  if (index > -1) teamPlayers.splice(index, 1);
  return data;
}
