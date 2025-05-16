import { readMainDataFile } from "@backend/services/readFile";
import { TeamObject } from "@/types/team";
import { PlayerObject } from "@/types/player";

export function getTeamInfoByIdService(teamId: string): TeamObject {
  const mainData = readMainDataFile();
  const team = mainData.teams[teamId];

  if (!team) {
    throw new Error(`Unable to find team: ${teamId}`);
  }

  return {
    team_id: teamId,
    team_name: team.team_name,
    players: team.players,
  } as TeamObject;
}

export function getPlayersInfoService(playerIds: string[]): PlayerObject[] {
  const mainData = readMainDataFile();

  return playerIds.map((playerId) => {
    const player = mainData.players[playerId];

    if (!player) {
      throw new Error(`Unable to find player: ${playerId}`);
    }

    return {
      player_id: playerId,
      player_name: player.name,
      player_photo: player.photo,
    } as PlayerObject;
  });
}
