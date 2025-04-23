// backend\controllers\gameObjectController.ts

// next
import { NextResponse } from "next/server";
// util
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "../services/readFile";
// types
import {
  ChangePlayerStatusInTeamRequest,
  CreatePlayerRequest,
  CreateTeamRequest,
} from "../config/types";
// logic & data layer
import {
  addPlayerToTeam,
  createPlayerObject,
  createTeamObject,
  removePlayerFromTeam,
} from "../services/createGameObject";

/**
 * Type signature for mutation functions that mutate the main data file.
 * These functions receive the current data and request specific payload,
 * and return updated data to be saved.
 */
type MutationHandler<T = any> = (data: any, reqData: T) => any;

/**
 * Interface for the input to the reusable data-mutation wrapper.
 */
interface FuncWrapper<T = any> {
  body: T; // Incoming request
  mutationFunc: MutationHandler<T>; // Logic function that performs the mutation
  errorMsg: string; // Error message to display on failure
}

/**
 * Shared wrapper to handle common backend tasks:
 *  1. Parse request body
 *  2. Read data from disk
 *  3. Pass to a logic function
 *  4. Save updated data to disk
 *  5. Return  success or error response
 *
 * @param req          The incoming Next.js API request
 * @param mutationFunc Function to apply  logic and return updated data
 * @param errorMsg     Message to include in error response/log if mutation fails
 * @returns            JSON response containing updated data or error
 */
export async function wrapDataMutation<T>({
  body,
  mutationFunc,
  errorMsg,
}: FuncWrapper<T>) {
  try {
    const main_data = readMainDataFile();
    const updated_data = mutationFunc(main_data, body);
    overwriteFile(DATA_FILE, updated_data);
    return NextResponse.json({ status: 200, data: updated_data });
  } catch (err) {
    console.error(`${errorMsg}:`, err);
    return NextResponse.json({ status: 500, error: errorMsg });
  }
}

// ------------------------------------------------------------------------------------

/**
 * API handler for creating a new player and storing it in the main data file.
 */
export async function createPlayerHandler(body: CreatePlayerRequest) {
  return wrapDataMutation<CreatePlayerRequest>({
    body: body,
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

/**
 * API handler for creating a new team and storing it in the main data file.
 */
export async function createTeamHandler(body: CreateTeamRequest) {
  return wrapDataMutation<CreateTeamRequest>({
    body: body,
    mutationFunc: (data, reqData) => {
      return createTeamObject({
        data,
        teamName: reqData.team_name,
      });
    },
    errorMsg: "Failed to create team",
  });
}

/**
 * API handler for adding a player to a team.
 */
export async function addPlayerToTeamHandler(
  body: ChangePlayerStatusInTeamRequest
) {
  return wrapDataMutation<ChangePlayerStatusInTeamRequest>({
    body: body,
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

/**
 * API handler for removing a player from a team.
 */
export async function removePlayerToTeamHandler(
  body: ChangePlayerStatusInTeamRequest
) {
  return wrapDataMutation<ChangePlayerStatusInTeamRequest>({
    body: body,
    mutationFunc: (data, reqData) => {
      return removePlayerFromTeam({
        data,
        teamId: reqData.player_id,
        playerId: reqData.player_id,
      });
    },
    errorMsg: "Failed to remove player from team",
  });
}
