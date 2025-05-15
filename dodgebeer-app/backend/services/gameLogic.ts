import { GameConfig, GameData, Round } from "@/types/game-data";
import { readGameDataFile } from "@backend/services/readFile";
import {
  addActionToPlayer,
  flipTeamSides,
  getCurRound,
  getEmptyRound,
  getPreviousRound,
  getTeamKeyByTeamId,
  isRoundsEmpty,
} from "@backend/services/gameUtil";
import { round } from "@popperjs/core/lib/utils/math";
import { overWriteGameFile } from "@backend/services/createGameObject";

export function handleFirstHit(game: GameData) {}

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

  let curRound: Round;
  // first action ever
  if (isRoundsEmpty(rounds)) {
    // check if T2 scored. if so need to create first round empty since T1 missed everything
    curRound = getEmptyRound();
    if (actionTeamKey.curSide == GameConfig.TEAM1_KEY) {
      //team 1 scored -> T1 started Round1
      curRound = addActionToPlayer({
        round: curRound,
        player_id: playerId,
        action: "HIT",
        time: time,
        teamKey: actionTeamKey.curSide,
      });
    } else {
      //team 2 scored -> T1 missed Round1 -> T2 started Round2
      const emptyRound = getEmptyRound();
      curRound = getEmptyRound();
      flipTeamSides(curRound); // make T2 attack
      rounds.push(emptyRound);
    }

    //overwrite file
    rounds.push(curRound);
    overWriteGameFile(gameId, game);
    // flip sides
  } else {
    // another hit from existing round
    curRound = getCurRound(rounds);
  }

  // keep checking if this is null
  let prevRound = null;
  try {
    prevRound = getPreviousRound(rounds);
  } catch {}

  // now need to handle case where
  // * it's first round
}
