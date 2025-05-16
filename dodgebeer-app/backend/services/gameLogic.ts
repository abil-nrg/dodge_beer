import { GameConfig, GameData, Round, TeamKeys } from "@/types/game-data";
import { readGameDataFile } from "@backend/services/readFile";
import {
  addActionToPlayer,
  cleanUpRoundActions,
  getEmptyRound,
  getLastRound,
  getTeamAndPlayersByGameId,
  getTeamKeyByTeamId,
  GetTeamKeyByTeamIdReturnType,
  isRoundsEmpty,
  setTeamToAttack,
  setTeamToDefence,
} from "@backend/services/gameUtil";
import {
  PlayerStats,
  PlayerStatsWithInfo,
  UpdateGameResponse,
} from "@/types/game-api";
import { getTeamInfoByIdService } from "@backend/services/playerAndTeamUtil";
import { ApiSuccess } from "@/types/api";

function isSubset<T>(array1: T[], array2: T[]): boolean {
  return array1.every((item) => array2.includes(item));
}

function handleFirstEverAction(
  actionTeamKey: GetTeamKeyByTeamIdReturnType,
  playerId: string,
  time?: number,
): Round[] {
  const emptyRound = getEmptyRound();

  if (actionTeamKey.curSide === GameConfig.TEAM1_KEY) {
    // TEAM1 starts the game with a HIT
    const round = addActionToPlayer({
      round: emptyRound,
      player_id: playerId,
      action: "HIT",
      time,
      teamKey: GameConfig.TEAM1_KEY,
    });

    const finalRound = cleanUpRoundActions(round);
    return [finalRound];
  } else {
    // TEAM2 scored first, meaning TEAM1 missed everything
    const missedRound = getEmptyRound();
    const t2Round = addActionToPlayer({
      round: getEmptyRound(),
      player_id: playerId,
      action: "HIT",
      time,
      teamKey: GameConfig.TEAM2_KEY,
    });
    const t2AttackRound = setTeamToAttack(t2Round, {
      curSide: GameConfig.TEAM2_KEY,
      oppositeSide: GameConfig.TEAM1_KEY,
    });

    const finalRound = cleanUpRoundActions(t2AttackRound);
    return [missedRound, finalRound];
  }
}

export function handleHit(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  const game = readGameDataFile(gameId);
  const { team1_id, team2_id, rounds } = game;

  const actionTeamKey = getTeamKeyByTeamId({
    data: { team1_id, team2_id },
    inputTeamId: teamId,
  });

  if (isRoundsEmpty(rounds)) {
    return {
      ...game,
      status: "IN_PROGRESS",
      rounds: handleFirstEverAction(actionTeamKey, playerId, time),
    } as GameData;
  }

  const lastIndex = rounds.length - 1;
  const lastRound = getLastRound(rounds);

  const needsNewRound =
    playerId in lastRound[actionTeamKey.curSide].players ||
    lastRound[actionTeamKey.curSide].side === "DEFENCE";

  if (needsNewRound) {
    const roundsToAdd: Round[] = [];

    if (lastRound[actionTeamKey.curSide].side === "DEFENCE") {
      const player_len = 3; // TODO: hardcoded for now
      const attackedPlayers = lastRound[actionTeamKey.oppositeSide].players;
      const isBallsBack = Object.keys(attackedPlayers).length === player_len;

      if (isBallsBack) {
        roundsToAdd.push(getEmptyRound()); // add empty round if needed
      }
    }

    const newRound = addActionToPlayer({
      round: getEmptyRound(),
      player_id: playerId,
      action: "HIT",
      time,
      teamKey: actionTeamKey.curSide,
    });

    const attackRound = setTeamToAttack(newRound, actionTeamKey);
    const finalRound = cleanUpRoundActions(attackRound);
    roundsToAdd.push(finalRound); // always add the new round

    return {
      ...game,
      rounds: [...rounds, ...roundsToAdd],
    } as GameData;
  }

  const updatedRound = addActionToPlayer({
    round: lastRound,
    player_id: playerId,
    action: "HIT",
    time,
    teamKey: actionTeamKey.curSide,
  });

  const attackUpdatedRound = setTeamToAttack(updatedRound, actionTeamKey);
  // delete all extra hits if happened:
  const finalRound = cleanUpRoundActions(attackUpdatedRound);
  // update
  const updatedRounds = [...rounds];
  updatedRounds[lastIndex] = finalRound;

  return {
    ...game,
    rounds: updatedRounds,
  } as GameData;
}

//------------------------------------
export function handleSave(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  const game = readGameDataFile(gameId);
  const { team1_id, team2_id, rounds } = game;

  const lastIndex = rounds.length - 1;
  const currentRound = rounds[lastIndex];

  const actionTeamKey = getTeamKeyByTeamId({
    data: { team1_id, team2_id },
    inputTeamId: teamId,
  });

  // Apply SAVE and set defence
  const updatedRound = addActionToPlayer({
    round: setTeamToDefence(currentRound, actionTeamKey),
    player_id: playerId,
    action: "SAVE",
    teamKey: actionTeamKey.curSide,
    time,
  });

  // Replace the last round immutably
  const updatedRounds = [...rounds];
  updatedRounds[lastIndex] = updatedRound;

  return {
    ...game,
    rounds: updatedRounds,
  } as GameData;
}
//------------------------------------
export function addPlayerDone(gameId: string, playerId: string) {
  const game = readGameDataFile(gameId);
  const rounds = game.rounds;
  const lastIndex = rounds.length - 1;
  const curRound = rounds[lastIndex];
  const newPlayersDone = [...curRound.players_done, playerId];

  // Create a new round with updated players_done
  const updatedRound: Round = {
    ...curRound,
    players_done: newPlayersDone,
  };

  // check if game is done
  let status = "IN_PROGRESS";
  const team1 = game.team1_id;
  const team1Info = getTeamInfoByIdService(team1);
  if (isSubset(team1Info.players, newPlayersDone)) {
    status = "DONE";
  } else {
    const team2 = game.team2_id;
    const team2Info = getTeamInfoByIdService(team2);
    if (isSubset(team2Info.players, newPlayersDone)) {
      status = "DONE";
    }
  }

  // Replace in a new array
  const updatedRounds = [...rounds];
  updatedRounds[lastIndex] = updatedRound;

  return {
    ...game,
    status: status,
    rounds: updatedRounds,
  } as GameData;
}
//------------------------------------
export function skipRoundService(gameId: string) {
  const game = readGameDataFile(gameId);
  game.rounds = [...game.rounds, getEmptyRound()];
}

//------------------------------------
export function getPlayerStats(gameId: string) {
  const game = readGameDataFile(gameId);
  const stats = calculatePlayerStats(game);
  const bothTeams = getTeamAndPlayersByGameId(gameId);

  const players: PlayerStatsWithInfo[] = [];

  const addPlayersFromTeam = (
    team: typeof bothTeams.team1 | typeof bothTeams.team2,
  ) => {
    for (const pl_info of team.players) {
      const player_stats = stats[pl_info.player_id];
      if (player_stats) {
        players.push({
          player_id: pl_info.player_id,
          player_name: pl_info.player_name,
          team_name: team.team.team_name,
          ...player_stats,
        });
      }
    }
  };

  addPlayersFromTeam(bothTeams.team1);
  addPlayersFromTeam(bothTeams.team2);

  return ApiSuccess<{ players: PlayerStatsWithInfo[] }>({ players });
}
//------------------------------------

export function calculatePlayerStats(
  game: GameData,
): Record<string, PlayerStats> {
  const stats: Record<string, PlayerStats> = {};

  const playerDoneRounds = new Set<string>();

  game.rounds.forEach((round, roundIndex) => {
    const roundNumber = roundIndex + 1;

    // Track done players early
    round.players_done.forEach((playerId) => {
      if (!stats[playerId]) {
        stats[playerId] = {
          hits: 0,
          misses: 0,
          saves: 0,
          attack_rounds: 0,
          defence_rounds: 0,
        };
      }
      if (stats[playerId].player_done_round === undefined) {
        stats[playerId].player_done_round = roundNumber;
        playerDoneRounds.add(playerId);
      }
    });

    // Evaluate each team
    (["team1_id", "team2_id"] as TeamKeys[]).forEach((teamKey) => {
      const teamData = round[teamKey];
      const isAttack = teamData.side === GameConfig.ATTACK;
      const isDefence = teamData.side === GameConfig.DEFENCE;

      const allPlayers = new Set([
        ...Object.keys(teamData.players),
        ...Object.keys(stats),
      ]);

      for (const playerId of allPlayers) {
        if (!stats[playerId]) {
          stats[playerId] = {
            hits: 0,
            misses: 0,
            saves: 0,
            attack_rounds: 0,
            defence_rounds: 0,
          };
        }

        const hasDone =
          stats[playerId].player_done_round !== undefined &&
          stats[playerId].player_done_round! <= roundNumber;

        if (hasDone) continue;

        const actions = teamData.players[playerId] ?? [];
        const hasHit = actions.some((a) => a.action === "HIT");
        const hasSave = actions.some((a) => a.action === "SAVE");

        if (isAttack) {
          stats[playerId].attack_rounds += 1;
          if (hasHit) {
            stats[playerId].hits += 1;
          } else {
            stats[playerId].misses += 1;
          }
        }

        if (isDefence) {
          stats[playerId].defence_rounds += 1;
          if (hasSave) {
            stats[playerId].saves += 1;
          }
        }
      }
    });
  });

  return stats;
}

//------------------------------------
export function getGameState(gameId: string) {
  const game = readGameDataFile(gameId);
  const rounds = game.rounds;
  const roundCounter = rounds.length;

  // first round
  if (rounds.length - 1 <= 0) {
    return {
      round_counter: roundCounter,
      team1_id: game.team1_id,
      team2_id: game.team2_id,
      team1_side: "ATTACK",
      team2_side: "DEFENCE",
    } as UpdateGameResponse;
  }
  const lastRound = rounds[rounds.length - 1];
  return {
    status: game.status,
    round_counter: roundCounter,
    team1_id: game.team1_id,
    team2_id: game.team2_id,
    team1_side: lastRound.team1_id.side,
    team2_side: lastRound.team2_id.side,
  } as UpdateGameResponse;
}
