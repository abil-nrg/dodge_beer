import { NextRequest, NextResponse } from "next/server";
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "../services/readFile";
import { CreatePlayerRequest, CreateTeamRequest } from "../config/types";
import {
  createPlayerObject,
  createTeamObject,
} from "../services/createGameObject";

export async function createPlayerHandler(req: NextRequest) {
  const req_data = (await req.json()) as CreatePlayerRequest;

  const main_data = readMainDataFile();
  try {
    const updated_data = createPlayerObject({
      data: main_data,
      playerName: req_data.player_name,
      playerPhoto: req_data.player_photo,
    });

    overwriteFile(DATA_FILE, updated_data);
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("Failed to create player:", err);
    return NextResponse.json({ status: 500 });
  }
}

export async function createTeamHandler(req: NextRequest) {
  const req_data = (await req.json()) as CreateTeamRequest;

  const main_data = readMainDataFile();
  try {
    const updated_data = createTeamObject({
      data: main_data,
      teamName: req_data.team_name,
    });

    overwriteFile(DATA_FILE, updated_data);
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("Failed to create player:", err);
    return NextResponse.json({ status: 500 });
  }
}

export async function addPlayerToTeamHandler(req: NextRequest) {
  const req_data = (await req.json()) as CreateTeamRequest;

  const main_data = readMainDataFile();
  try {
    const updated_data = createTeamObject({
      data: main_data,
      teamName: req_data.team_name,
    });

    overwriteFile(DATA_FILE, updated_data);
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("Failed to create player:", err);
    return NextResponse.json({ status: 500 });
  }
}
