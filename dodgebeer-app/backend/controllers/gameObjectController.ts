import { NextRequest, NextResponse } from "next/server";
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "../services/readFile";
import {
  ChangePlayerStatusInTeamRequest,
  CreatePlayerRequest,
  CreateTeamRequest,
} from "../config/types";
import {
  addPlayerToTeam,
  createPlayerObject,
  createTeamObject,
  removePlayerFromTeam,
} from "../services/createGameObject";

type MutationHandler<T = any> = (data: any, reqData: T) => any;

interface FuncWrapper {
  req: NextRequest;
  mutationFunc: MutationHandler;
  errorMsg: string;
}
export async function wrapDataMutation<T = any>({
  req,
  mutationFunc,
  errorMsg,
}: FuncWrapper) {
  try {
    const req_data = (await req.json()) as T;
    const main_data = readMainDataFile();

    const updated_data = mutationFunc(main_data, req_data);
    overwriteFile(DATA_FILE, updated_data);

    return NextResponse.json({ status: 200, data: updated_data });
  } catch (err) {
    console.error(`${errorMsg}:`, err);
    return NextResponse.json({ status: 500, error: errorMsg });
  }
}

export async function createPlayerHandler(req: NextRequest) {
  return wrapDataMutation<CreatePlayerRequest>({
    req: req,
    mutationFunc: (data, reqData) => {
      return createPlayerObject({
        data,
        playerName: reqData.player_name,
        playerPhoto: reqData.player_photo,
      });
    },
    errorMsg: "Failed to create player",
  });
}

export async function createTeamHandler(req: NextRequest) {
  return wrapDataMutation<CreateTeamRequest>({
    req: req,
    mutationFunc: (data, reqData) => {
      return createTeamObject({
        data,
        teamName: reqData.team_name,
      });
    },
    errorMsg: "Failed to create team",
  });
}

export async function addPlayerToTeamHandler(req: NextRequest) {
  return wrapDataMutation<ChangePlayerStatusInTeamRequest>({
    req: req,
    mutationFunc: (data, reqData) => {
      return addPlayerToTeam({
        data,
        teamId: reqData.player_id,
        playerId: reqData.player_id,
      });
    },
    errorMsg: "Failed to add player to team",
  });
}

export async function removePlayerToTeamHandler(req: NextRequest) {
  return wrapDataMutation<ChangePlayerStatusInTeamRequest>({
    req: req,
    mutationFunc: (data, reqData) => {
      return addPlayerToTeam({
        data,
        teamId: reqData.player_id,
        playerId: reqData.player_id,
      });
    },
    errorMsg: "Failed to remove player from team",
  });
}
