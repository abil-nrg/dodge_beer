import { NextResponse } from "next/server";
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "../services/readFile";
import {
  GetAllPlayersResponse,
  GetAllPlayersSchema,
  GetAllTeamsResponse,
  GetAllTeamsSchema,
  GetPlayerPhotoQueryRequest,
  GetPlayerPhotoResponse,
} from "../config/types";
import Config, { MainDataSchema, MainDataType } from "../config/config";

export function clearMainData() {
  overwriteFile(DATA_FILE, Config.EMPTY_DATA_FILE);
  return getMainData();
}

export async function getMainData() {
  const full_data = readMainDataFile();
  const response = MainDataSchema.parse(full_data);

  return NextResponse.json({ status: 200, data: response as MainDataType });
}

export async function getAllTeamsHandler() {
  const full_data = readMainDataFile();
  const response = GetAllTeamsSchema.parse(full_data);

  return NextResponse.json({
    status: 200,
    data: response as GetAllTeamsResponse,
  });
}

export async function getAllPlayersHandler() {
  const full_data = readMainDataFile();
  const response = GetAllPlayersSchema.parse(full_data);

  return NextResponse.json({
    status: 200,
    data: response as GetAllPlayersResponse,
  });
}

export async function getPlayerPhotoHandler({
  player_id,
}: GetPlayerPhotoQueryRequest) {
  const full_data = readMainDataFile();
  const data = GetAllPlayersSchema.parse(full_data).players;

  const player = data[player_id];

  if (player && player.photo) {
    return NextResponse.json({
      status: 200,
      data: { photo: player.photo } as GetPlayerPhotoResponse,
    });
  } else {
    return NextResponse.json({
      status: 200,
      data: { photo: Config.DEFAULT_PHOTO } as GetPlayerPhotoResponse,
    });
  }
}
