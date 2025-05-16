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
) {
  console.log("----------------------");
  console.log("Handling First Action Ever");
  console.log("playerId is " + playerId);
  console.log("actionTeamKey is " + actionTeamKey);
  // check if T2 scored. if so need to create first round empty since T1 missed everything
  const newRounds: Round[] = [];
  if (actionTeamKey.curSide === GameConfig.TEAM1_KEY) {
    //team 1 scored -> T1 started Round1
    console.log("Team 1 HITS!");
    newRounds.push(
      addActionToPlayer({
        round: getEmptyRound(),
        player_id: playerId,
        action: "HIT",
        time: time,
        teamKey: GameConfig.TEAM1_KEY,
      }),
    );
  } else {
    //team 2 scored -> T1 missed Round1 -> T2 started Round2
    console.log("Team 1 MISS!");
    console.log("Team 2 HITS!");
    const t2AttackRound = addActionToPlayer({
      round: getEmptyRound(),
      player_id: playerId,
      action: "HIT",
      time: time,
      teamKey: GameConfig.TEAM2_KEY,
    });
    // need to make sure t2 is ATTACK
    setTeamToAttack(t2AttackRound, {
      curSide: GameConfig.TEAM2_KEY,
      oppositeSide: GameConfig.TEAM1_KEY,
    });

    newRounds.push(getEmptyRound()); // T1 missed all
    newRounds.push(t2AttackRound);
  }
  console.log("New Rounds length is " + newRounds.length);
  console.log("----------------------");
  //overwrite file
  return newRounds;
}

export function handleHit(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  const game = readGameDataFile(gameId);
  const rounds = game.rounds;
  // find team Key
  const actionTeamKey = getTeamKeyByTeamId({
    data: { team1_id: game.team1_id, team2_id: game.team2_id },
    inputTeamId: teamId,
  });
  console.log("actionTeamKey is " + actionTeamKey + "\n");
  // first action ever
  if (isRoundsEmpty(rounds)) {
    game.status = "IN_PROGRESS";
    game.rounds = handleFirstEverAction(actionTeamKey, playerId, time);
    return game;
  }
  // another hit from existing round
  const lastSavedRound = getCurRound(rounds);

  // first need to verify if I should make new round
  if (
    playerId in lastSavedRound[actionTeamKey.curSide].players ||
    lastSavedRound[actionTeamKey.curSide].side === "DEFENCE"
  ) {
    // player already had a HIT in curRound so actually need to make a new round
    console.log(
      "Player had action in last round, or last round was DEFENCE for him",
    );
    const curRound = addActionToPlayer({
      round: getEmptyRound(),
      player_id: playerId,
      action: "HIT",
      teamKey: actionTeamKey.curSide,
      time: time,
    });
    // make sure team is attacking
    const updatedRound0 = setTeamToAttack(curRound, actionTeamKey);
    // done with all
    game.rounds = [...game.rounds, updatedRound0];
    return game;
  }
  console.log("Player had no action yet. Appending to existing round");
  // at this point player had no action in this round
  // so just append new action
  const updatedRound1 = addActionToPlayer({
    round: lastSavedRound,
    player_id: playerId,
    action: "HIT",
    teamKey: actionTeamKey.curSide,
    time: time,
  });
  // make sure team is attacking
  const updatedRound2 = setTeamToAttack(updatedRound1, actionTeamKey);
  // done with all
  const updatedRounds = [...game.rounds];
  updatedRounds[rounds.length - 1] = updatedRound2;
  //reassign
  game.rounds = updatedRounds;
  return game;
}
//------------------------------------
export function handleSave(
  gameId: string,
  teamId: string,
  playerId: string,
  time?: number,
) {
  const game = readGameDataFile(gameId);
  let rounds = game.rounds;
  let curRound = rounds[rounds.length - 1];
  // gets which side teamId is on
  const actionTeamKey = getTeamKeyByTeamId({
    data: { team1_id: game.team1_id, team2_id: game.team2_id },
    inputTeamId: teamId,
  });

  // set team from player SAVE to Defence just in case
  curRound = setTeamToDefence(curRound, actionTeamKey);
  // add action
  curRound = addActionToPlayer({
    round: curRound,
    player_id: playerId,
    action: "SAVE",
    teamKey: actionTeamKey.curSide,
    time: time,
  });
  // reassign rounds and write to file
  rounds[rounds.length - 1] = curRound;
  game.rounds = rounds;
  overWriteGameFile(gameId, game);
  return game;
}

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
