import Config, { MainDataType, Player, Team } from "../config/config";

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
  const playerKey = `${Config.PLAYER_KEY}${data.player_count}`;
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
  const teamKey = `${Config.TEAM_KEY}${data.team_count}`;
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
  const player: Player = data.players[playerId];
  data.teams[teamId].players.push(player);
  return data;
}

export function removePlayerFromTeam({
  data,
  teamId,
  playerId,
}: ChangePlayerInTeamInterface) {
  const teamPlayers = data.teams[teamId].players;
  const playerToRemove = data.players[playerId];

  const index = teamPlayers.findIndex(
    (player) =>
      player.name === playerToRemove.name &&
      player.photo === playerToRemove.photo
  );
  if (index > -1) teamPlayers.splice(index, 1);
  return data;
}
