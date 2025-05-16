import { GameConfig, Round } from "@/types/game-data";
import { readGameDataFile } from "@backend/services/readFile";
import {
  addActionToPlayer,
  getCurRound,
  getEmptyRound,
  getTeamKeyByTeamId,
  GetTeamKeyByTeamIdReturnType,
  isRoundsEmpty,
  setTeamToAttack,
  setTeamToDefence,
} from "@backend/services/gameUtil";
import { overWriteGameFile } from "@backend/services/createGameObject";
import { UpdateGameResponse } from "@/types/game-api";

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
    return [round];
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

    return [missedRound, t2AttackRound];
  }
}

export function handleHit(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  console.log("------------------------------");
  console.log("HIT RECEIVED FOR " + playerId);
  console.log("------------------------------");

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
    };
  }

  const lastIndex = rounds.length - 1;
  const lastRound = getCurRound(rounds);

  const needsNewRound =
    playerId in lastRound[actionTeamKey.curSide].players ||
    lastRound[actionTeamKey.curSide].side === "DEFENCE";

  if (needsNewRound) {
    const newRound = addActionToPlayer({
      round: getEmptyRound(),
      player_id: playerId,
      action: "HIT",
      time,
      teamKey: actionTeamKey.curSide,
    });
    const attackRound = setTeamToAttack(newRound, actionTeamKey);

    return {
      ...game,
      rounds: [...rounds, attackRound],
    };
  }

  const updatedRound = addActionToPlayer({
    round: lastRound,
    player_id: playerId,
    action: "HIT",
    time,
    teamKey: actionTeamKey.curSide,
  });

  const finalRound = setTeamToAttack(updatedRound, actionTeamKey);
  const updatedRounds = [...rounds];
  updatedRounds[lastIndex] = finalRound;

  return {
    ...game,
    rounds: updatedRounds,
  };
}

//------------------------------------
export function handleSave(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  console.log("------------------------------");
  console.log("SAVE RECEIVED FOR " + playerId);
  console.log("------------------------------");
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

  const updatedGame = {
    ...game,
    rounds: updatedRounds,
  };

  overWriteGameFile(gameId, updatedGame);
  return updatedGame;
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
    round_counter: roundCounter,
    team1_id: game.team1_id,
    team2_id: game.team2_id,
    team1_side: lastRound.team1_id.side,
    team2_side: lastRound.team2_id.side,
  } as UpdateGameResponse;
}
