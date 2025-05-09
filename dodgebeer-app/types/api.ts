import { NextResponse } from "next/server";

export const enum HTTP_CODE {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export function ApiSuccess<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data });
}

export type ResponseWithErrorInData = {
  error: string;
};

export function ApiError({
  status,
  message,
}: {
  status: number;
  message: string;
}): NextResponse<ApiResponse<ResponseWithErrorInData>> {
  return NextResponse.json(
    { success: false, data: { error: message } },
    { status },
  );
}
