import { NextResponse } from "next/server";
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "../services/readFile";
import { GetAllPlayersSchema, GetAllTeamsSchema } from "../config/types";
import Config, { MainDataSchema } from "../config/config";

export function clearMainData() {
  overwriteFile(DATA_FILE, Config.EMPTY_DATA_FILE);
  return getMainData();
}

export async function getMainData() {
  const full_data = readMainDataFile();
  const response = MainDataSchema.parse(full_data);

  return NextResponse.json({ status: 200, data: response });
}

export async function getAllTeamsHandler() {
  const full_data = readMainDataFile();
  const response = GetAllTeamsSchema.parse(full_data);

  return NextResponse.json({ status: 200, data: response });
}

export async function getAllPlayersHandler() {
  const full_data = readMainDataFile();
  const response = GetAllPlayersSchema.parse(full_data);

  return NextResponse.json({ status: 200, data: response });
}
