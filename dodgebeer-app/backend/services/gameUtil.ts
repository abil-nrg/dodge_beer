import { readGameDataFile } from "@backend/services/readFile";
import {
  getPlayersInfoService,
  getTeamInfoByIdService,
} from "@backend/services/playerAndTeamUtil";
import { FullTeamObject, GetBothTeamsResponse } from "@/types/team";

export function getTeamAndPlayersByGameId(gameId: string) {
  const game = readGameDataFile(gameId);
  // team1
  const team1 = game.team1_id;
  const team1Info = getTeamInfoByIdService(team1);
  const team1Players = getPlayersInfoService(team1Info.players);
  const fullTeam1Object = {
    team: team1Info,
    players: team1Players,
  } as FullTeamObject;
  // team2
  const team2 = game.team2_id;
  const team2Info = getTeamInfoByIdService(team2);
  const team2Players = getPlayersInfoService(team2Info.players);
  const fullTeam2Object = {
    team: team2Info,
    players: team2Players,
  } as FullTeamObject;

  return {
    team1: fullTeam1Object,
    team2: fullTeam2Object,
  } as GetBothTeamsResponse;
}
