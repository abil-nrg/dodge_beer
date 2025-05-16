import { DATA_FOLDER_PATH, overwriteFile } from "@backend/services/readFile";
import { GameConfig, GameData } from "@/types/game-data";
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
  const gameFileName = `${GameConfig.GAME}${game_num}`;
  const filePath = path.join(DATA_FOLDER_PATH, gameFileName);
  overwriteFile(`${filePath}.json`, structureInitialGame(team1, team2));
  return gameFileName;
}

export function overWriteGameFile(gameFullName: string, game: GameData) {
  const filePath = path.join(DATA_FOLDER_PATH, gameFullName);
  overwriteFile(`${filePath}.json`, game);
}

function structureInitialGame(team1: string, team2: string) {
  return {
    status: "NOT_STARTED",
    team1_id: team1,
    team2_id: team2,
    rounds: [],
  } as GameData;
}
