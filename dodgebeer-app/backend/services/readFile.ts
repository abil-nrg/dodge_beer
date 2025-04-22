import path from "path";
import fs from "fs";
import Config, { MAIN_DATA_FILE_TYPE } from "../config/config";

const CUR_PATH = path.join(__dirname, "..", "data");
// files
const DATA_FILE = path.join(CUR_PATH, Config.DATA_FILE) + ".json";
const STAT_FILE = path.join(CUR_PATH, Config.STAT_FILE) + ".json";
const GAME_FILE = path.join(CUR_PATH, Config.GAME_FILE) + ".json";

interface EnsureFileExistsOptions {
  filePath: string;
  content?: any;
  isResetFile?: boolean;
}

function ensureFileExists({
  filePath,
  content = {},
  isResetFile = false,
}: EnsureFileExistsOptions) {
  const dir = path.dirname(filePath);

  // Ensure the folder exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create the file if it doesn't exist or the flag is set to reset
  if (isResetFile || !fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}

function overwriteFile(filePath: string, content: any = {}) {
  ensureFileExists({
    filePath: filePath,
    content: content,
    isResetFile: true,
  });
}

function readMainDataFile() {
  ensureFileExists({
    filePath: DATA_FILE,
    content: Config.EMPTY_DATA_FILE,
  });
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data) as MAIN_DATA_FILE_TYPE;
}

export {
  CUR_PATH,
  DATA_FILE,
  STAT_FILE,
  GAME_FILE,
  ensureFileExists,
  overwriteFile,
  readMainDataFile,
};
