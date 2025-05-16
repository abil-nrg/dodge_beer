import { readGameDataFile } from "@backend/services/readFile";
import {
  getPlayersInfoService,
  getTeamInfoByIdService,
} from "@backend/services/playerAndTeamUtil";
import { FullTeamObject, GetBothTeamsResponse } from "@/types/team";
import {
  EmptyRound,
  GameConfig,
  PlayerAction,
  PlayerActionType,
  Round,
  TeamKeys,
} from "@/types/game-data";

/** -------------------------------------------- **/

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

/** -------------------------------------------- **/
export function isRoundsEmpty(rounds: Round[]) {
  return rounds.length === 0;
}
/** -------------------------------------------- **/

export function isNoActionRound(round: Round) {
  if (Object.keys(round.team1_id.players).length !== 0) {
    return false;
  }

  return Object.keys(round.team2_id.players).length === 0;
}

/** -------------------------------------------- **/
// export function deleteAllExtraHits(round: Round, teamKey: TeamKeys) {
//   const team = round[teamKey];
//
//   const cleanedPlayers: Record<string, PlayerAction[]> = {};
//
//   Object.entries(team.players).forEach(([playerId, actions]) => {
//     // Keep only the last HIT if it exists
//     const lastHit = [...actions].reverse().find((a) => a.action === "HIT");
//     if (lastHit) {
//       cleanedPlayers[playerId] = [lastHit];
//     }
//   });
//
//   return {
//     ...round,
//     [teamKey]: {
//       ...team,
//       players: cleanedPlayers,
//     },
//   };
// }
/** -------------------------------------------- **/
export function cleanUpRoundActions(round: Round): Round {
  const cleanedRound: Round = { ...round };

  (["team1_id", "team2_id"] as TeamKeys[]).forEach((teamKey) => {
    const team = round[teamKey];
    const cleanedPlayers: Record<string, PlayerAction[]> = {};

    Object.entries(team.players).forEach(([playerId, actions]) => {
      if (team.side === GameConfig.ATTACK) {
        // Keep only the last HIT if any
        const lastHit = [...actions].reverse().find((a) => a.action === "HIT");
        if (lastHit) {
          cleanedPlayers[playerId] = [lastHit];
        }
      } else if (team.side === GameConfig.DEFENCE) {
        // Remove all HITs
        const filtered = actions.filter((a) => a.action !== "HIT");
        if (filtered.length > 0) {
          cleanedPlayers[playerId] = filtered;
        }
        // If filtered is empty, player will be omitted entirely
      }
    });

    cleanedRound[teamKey] = {
      ...team,
      players: cleanedPlayers,
    };
  });

  return cleanedRound;
}

/** -------------------------------------------- **/
export function getLastRound(rounds: Round[]) {
  const len = rounds.length;
  return rounds[len - 1];
}

/** -------------------------------------------- **/

export function getPreviousRound(rounds: Round[]) {
  const len = rounds.length;
  const lastIndex = len - 1;

  if (len <= 1) {
    throw new Error("No Previous Round. Catch This");
  }

  return rounds[lastIndex];
}

/** -------------------------------------------- **/

export function setPlayerIsDone(round: Round, player_id: string) {
  round.players_done.push(player_id);
  return round;
}

/** -------------------------------------------- **/
interface AddActionToPlayerProps {
  round: Round;
  teamKey: TeamKeys;
  player_id: string;
  action: PlayerActionType;
  time?: number;
}

export function addActionToPlayer({
  round,
  teamKey,
  player_id,
  action,
  time,
}: AddActionToPlayerProps) {
  const teamRoundData = round[teamKey];
  const playerStats = teamRoundData.players;
  // add player action to player
  (playerStats[player_id] ??= []).push({
    action,
    time: time ?? -1,
  });

  return round;
}

/** -------------------------------------------- **/
export function setTeamToAttack(
  round: Round,
  sides: GetTeamKeyByTeamIdReturnType,
) {
  round[sides.curSide].side = "ATTACK";
  round[sides.oppositeSide].side = "DEFENCE";
  return round;
}
/** -------------------------------------------- **/
export function setTeamToDefence(
  round: Round,
  sides: GetTeamKeyByTeamIdReturnType,
) {
  round[sides.curSide].side = "DEFENCE";
  round[sides.oppositeSide].side = "ATTACK";
  return round;
}
/** -------------------------------------------- **/

export function flipTeamSides(round: Round): Round {
  const curSide = round.team1_id.side;

  round.team1_id.side = curSide === "ATTACK" ? "DEFENCE" : "ATTACK";
  round.team2_id.side = curSide === "ATTACK" ? "ATTACK" : "DEFENCE";

  return round;
}

/** -------------------------------------------- **/

export function getEmptyRound() {
  return {
    team1_id: {
      side: "ATTACK",
      players: {},
    },
    team2_id: {
      side: "DEFENCE",
      players: {},
    },
    players_done: [],
  } as Round;
}

/** -------------------------------------------- **/

interface GetTeamKeyByTeamIdProps {
  data: {
    team1_id: string;
    team2_id: string;
  };
  inputTeamId: string;
}
export interface GetTeamKeyByTeamIdReturnType {
  curSide: TeamKeys;
  oppositeSide: TeamKeys;
}
export function getTeamKeyByTeamId({
  data,
  inputTeamId,
}: GetTeamKeyByTeamIdProps): GetTeamKeyByTeamIdReturnType {
  if (data.team1_id === inputTeamId) {
    return {
      curSide: GameConfig.TEAM1_KEY as TeamKeys,
      oppositeSide: GameConfig.TEAM2_KEY as TeamKeys,
    };
  }
  if (data.team2_id === inputTeamId) {
    return {
      curSide: GameConfig.TEAM2_KEY as TeamKeys,
      oppositeSide: GameConfig.TEAM1_KEY as TeamKeys,
    };
  }
  //refactor
  throw Error("Couldn't convert team id to team key in game");
}
