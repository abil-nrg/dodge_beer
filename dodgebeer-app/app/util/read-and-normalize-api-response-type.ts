import { ApiResponse, ResponseWithErrorInData } from "@/types/api";

export type NormalizedResponse<T> = {
  ok: boolean;
  data?: T;
  errMsg?: string;
};

/**
 * Converts an ApiResponse<T | E> into a normalized object.
 *
 * @param apiResponse - Original response returned from your API route.
 * @returns NormalizedResponse with ok flag, data or errMsg.
 */
export function normalizeApiResponse<T, E extends ResponseWithErrorInData>(
  apiResponse: ApiResponse<T | E>,
): NormalizedResponse<T> {
  if (apiResponse.success) {
    return { ok: true, data: apiResponse.data as T };
  } else {
    return {
      ok: false,
      errMsg: (apiResponse.data as E).error ?? "Unknown error",
    };
  }
}
