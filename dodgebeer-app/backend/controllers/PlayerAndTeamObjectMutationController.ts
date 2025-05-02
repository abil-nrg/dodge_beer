// backend\controllers\gameObjectController.ts

// next
import { NextResponse } from "next/server";
// util
import {
  DATA_FILE,
  overwriteFile,
  readMainDataFile,
} from "@/backend/services/readFile";
// types
import { CreatePlayerRequest, DeletePlayerRequest } from "@/types/player";
import {
  ChangePlayerStatusInTeamRequest,
  CreateTeamRequest,
  DeleteTeamRequest,
} from "@/types/team";
// logic & data layer
import {
  addPlayerToTeamService,
  createPlayerObjectService,
  createTeamObjectService,
  deletePlayerService,
  deleteTeamService,
  removePlayerFromTeamService,
} from "@backend/services/createPlayerAndTeamObject";
import { INTERNAL_ERROR, OK_RESPONSE_JSON } from "@/types/api";

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
    return new Response(JSON.stringify(updated_data as T), OK_RESPONSE_JSON);
  } catch (err) {
    console.error(`${errorMsg}:`, err);
    return new Response(JSON.stringify({ error: errorMsg }), INTERNAL_ERROR);
  }
}

// ------------------------------------------------------------------------------------

/**
 * API handler for creating a new player and storing it in the main data file.
 */
export async function createPlayerHandler(body: CreatePlayerRequest) {
  return wrapDataMutation<CreatePlayerRequest>({
    body: body,
    mutationFunc: (data, request) => {
      return createPlayerObjectService({
        data,
        body: request,
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
    mutationFunc: (data, request) => {
      return createTeamObjectService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to create team",
  });
}

/**
 * API handler for adding a player to a team.
 */
export async function addPlayerToTeamHandler(
  body: ChangePlayerStatusInTeamRequest,
) {
  return wrapDataMutation<ChangePlayerStatusInTeamRequest>({
    body: body,
    mutationFunc: (data, request) => {
      return addPlayerToTeamService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to add player to team",
  });
}

/**
 * API handler for removing a player from a team.
 */
export async function removePlayerToTeamHandler(
  body: ChangePlayerStatusInTeamRequest,
) {
  return wrapDataMutation<ChangePlayerStatusInTeamRequest>({
    body: body,
    mutationFunc: (data, request) => {
      return removePlayerFromTeamService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to remove player from team",
  });
}

export async function deleteTeamHandler(body: DeleteTeamRequest) {
  return wrapDataMutation<DeleteTeamRequest>({
    body: body,
    mutationFunc: (data, request) => {
      return deleteTeamService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to delete team",
  });
}

export async function deletePlayerHandler(body: DeletePlayerRequest) {
  return wrapDataMutation<DeletePlayerRequest>({
    body: body,
    mutationFunc: (data, request) => {
      return deletePlayerService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to delete player",
  });
}
