import { NextRequest, NextResponse } from "next/server";
import { getPlayerPhotoHandler } from "@backend/controllers/getterObjectController";
import { verifyQueryParams } from "@/app/api/middleware/requestHandler";
import { GetPlayerPhotoQueryRequestSchema } from "@backend/config/types";

export async function GET(req: NextRequest) {
  const params = verifyQueryParams(req, GetPlayerPhotoQueryRequestSchema);
  if (params instanceof NextResponse) {
    // error
    return params;
  }
  return getPlayerPhotoHandler(params);
}
