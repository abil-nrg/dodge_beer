// backend/services/readFile.ts

// util
import path from "path";
import fs from "fs";
// types
import { MainDataConfig, MainDataType } from "@/types/main-data";
import { GameData } from "@/types/game-data";

/**
 * Absolute path to the backend data directory.
 */
const DATA_FOLDER_PATH = path.join(process.cwd(), "backend", "data");

/**
 * Full path to the main data file used for storing application state.
 */
const DATA_FILE = path.join(DATA_FOLDER_PATH, MainDataConfig.DATA_FILE);

/**
 * Options for the `ensureFileExists` utility.
 */
interface EnsureFileExistsOptions {
  /**
   * Path to the file to check or create.
   */
  filePath: string;

  /**
   * Content to initialize the file with if it needs to be created or reset.
   * Defaults to an empty object.
   */
  content?: any;

  /**
   * If true, the file will be reset even if it already exists.
   */
  isResetFile?: boolean;
}

/**
 * Ensures that a file exists at the specified path. Creates the directory and file if they do not exist.
 * Optionally overwrites the file if `isResetFile` is true.
 *
 * @param filePath - Full path to the file.
 * @param content - Initial content to write if the file is created or reset.
 * @param isResetFile - Whether to forcibly overwrite the file.
 */
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

  // Create or reset the file if needed
  if (isResetFile || !fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}

/**
 * Overwrites the specified file with the given content.
 *
 * @param filePath - Path to the file.
 * @param content - New content to write into the file.
 */
function overwriteFile(filePath: string, content: any = {}) {
  ensureFileExists({
    filePath: filePath,
    content: content,
    isResetFile: true,
  });
}

/**
 * Reads and parses the main data file from disk.
 * If the file does not exist, it is created using the default empty config.
 *
 * @returns Parsed data conforming to MainDataType.
 */
function readMainDataFile(): MainDataType {
  ensureFileExists({
    filePath: DATA_FILE,
    content: MainDataConfig.EMPTY_DATA_FILE,
  });
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data) as MainDataType;
}

/**
 * Reads and parses game data file from disk
 * @param gameId "game1", "game2", etc
 *
 * @returns Parsed data
 */
function readGameDataFile(gameId: string): GameData {
  const gameFilePath = path.join(DATA_FOLDER_PATH, `${gameId}.json`);
  const data = fs.readFileSync(gameFilePath, "utf-8");
  return JSON.parse(data) as GameData;
}

export {
  DATA_FOLDER_PATH,
  DATA_FILE,
  ensureFileExists,
  overwriteFile,
  readMainDataFile,
  readGameDataFile,
};
