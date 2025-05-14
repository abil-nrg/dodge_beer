import { DATA_FOLDER_PATH, overwriteFile } from "@backend/services/readFile";
import { GameData } from "@/types/game-data";
import path from "path";

interface CreateGameProps {
  game_num: number;
  team1: string;
  team2: string;
}
export function createGameObjectService({
  game_num,
  team1,
  team2,
}: CreateGameProps) {
  const gameFileName = `${GameData.GAME}${game_num}`;
  const filePath = path.join(DATA_FOLDER_PATH, gameFileName);
  overwriteFile(`${filePath}.json`, structureInitialGame(team1, team2));
  return gameFileName;
}

function structureInitialGame(team1: string, team2: string) {
  return {
    team1_id: team1,
    team2_id: team2,
    round_counter: 0,
    rounds: [],
  };
}
