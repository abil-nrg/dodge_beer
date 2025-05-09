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
import {
  CreatePlayerRequest,
  CreatePlayerResponse,
  DeletePlayerRequest,
} from "@/types/player";
import {
  ChangePlayerStatusInTeamRequest,
  ChangePlayerStatusInTeamResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  DeleteTeamOrPlayerResponse,
  DeleteTeamRequest,
} from "@/types/team";
// logic & data layer
import {
  addPlayerToTeamService,
  createPlayerObjectService,
  createTeamObjectService,
  deletePlayerService,
  deleteTeamService,
  MutationReturn,
  removePlayerFromTeamService,
} from "@backend/services/createPlayerAndTeamObject";
import {
  ApiError,
  ApiResponse,
  ApiSuccess,
  HTTP_CODE,
  ResponseWithErrorInData,
} from "@/types/api";
import { MainDataType } from "@/types/main-data";

/**
 * Type signature for mutation functions that mutate the main data file.
 *
 * These functions:
 *  - Receive the current data and request-specific input
 *  - Mutate the data
 *  - Return the updated data and a typed response payload
 *
 * @template T - The shape of the incoming request payload
 * @template R - The shape of the mutation's response
 */
type MutationHandler<T, R> = (
  data: MainDataType,
  reqData: T,
) => MutationReturn<R>;

//-----------------------------------------------------------------------------//

/**
 * Wrapper object passed to the reusable mutation handler function.
 *
 * @template T - The request payload type
 * @template R - The mutation response type
 */
interface FuncWrapper<T, R> {
  /** Incoming request payload */
  body: T;

  /** The mutation function that performs logic and returns updated data + response */
  mutationFunc: MutationHandler<T, R>;

  /** Human-readable error message shown on failure */
  errorMsg: string;
}

//-----------------------------------------------------------------------------//

/**
 * Shared wrapper for performing backend mutations with consistent handling.
 *
 * This function:
 *  1. Reads the main data file from disk
 *  2. Executes a typed mutation function with the request payload
 *  3. Saves the updated data back to disk
 *  4. Returns a typed JSON response (success or structured error)
 *
 * All mutation functions must return an object of the form:
 *   { data: MainDataType, response: R }
 *
 * @template T - The shape of the incoming request body
 * @template R - The shape of the successful mutation response
 *
 * @param body         The request payload passed to the mutation function
 * @param mutationFunc A logic function that mutates the data and returns a response
 * @param errorMsg     A descriptive message logged and returned if an error occurs
 *
 * @returns A Next.js JSON response wrapping ApiResponse<R> on success,
 *          or ApiResponse<ResponseWithErrorInData> on failure
 */
export async function wrapDataMutation<T, R>({
  body,
  mutationFunc,
  errorMsg,
}: FuncWrapper<T, R>): Promise<
  NextResponse<ApiResponse<R | ResponseWithErrorInData>>
> {
  try {
    const main_data = readMainDataFile();
    const mutationResult = mutationFunc(main_data, body);

    const { data: updated_data, response: responseData } = mutationResult;

    overwriteFile(DATA_FILE, updated_data);

    return ApiSuccess<R>(responseData);
  } catch (err) {
    console.error(`Caught error in ${mutationFunc.name}.\n
                   Response error output ${errorMsg}\n
                   Func Error: ${err}\n`);
    return ApiError({
      status: HTTP_CODE.INTERNAL_SERVER_ERROR,
      message: errorMsg,
    });
  }
}

// ------------------------------------------------------------------------------------

/**
 * API handler for creating a new player and storing it in the main data file.
 */
export async function createPlayerHandler(requestBody: CreatePlayerRequest) {
  return wrapDataMutation<CreatePlayerRequest, CreatePlayerResponse>({
    body: requestBody,
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
export async function createTeamHandler(requestBody: CreateTeamRequest) {
  return wrapDataMutation<CreateTeamRequest, CreateTeamResponse>({
    body: requestBody,
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
  requestBody: ChangePlayerStatusInTeamRequest,
) {
  return wrapDataMutation<
    ChangePlayerStatusInTeamRequest,
    ChangePlayerStatusInTeamResponse
  >({
    body: requestBody,
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
  requestBody: ChangePlayerStatusInTeamRequest,
) {
  return wrapDataMutation<
    ChangePlayerStatusInTeamRequest,
    ChangePlayerStatusInTeamResponse
  >({
    body: requestBody,
    mutationFunc: (data, request) => {
      return removePlayerFromTeamService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to remove player from team",
  });
}

export async function deleteTeamHandler(requestBody: DeleteTeamRequest) {
  return wrapDataMutation<DeleteTeamRequest, DeleteTeamOrPlayerResponse>({
    body: requestBody,
    mutationFunc: (data, request) => {
      return deleteTeamService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to delete team",
  });
}

export async function deletePlayerHandler(requestBody: DeletePlayerRequest) {
  return wrapDataMutation<DeletePlayerRequest, DeleteTeamOrPlayerResponse>({
    body: requestBody,
    mutationFunc: (data, request) => {
      return deletePlayerService({
        data,
        body: request,
      });
    },
    errorMsg: "Failed to delete player",
  });
}
