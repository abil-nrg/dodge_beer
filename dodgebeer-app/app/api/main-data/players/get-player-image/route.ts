import { NextRequest, NextResponse } from "next/server";
import { getPlayerPhotoHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";
import { verifyQueryParams } from "@/app/api/middleware/requestHandler";
import { GetPlayerPhotoQueryRequestSchema } from "@/types/api";

export async function GET(req: NextRequest) {
  const params = verifyQueryParams(req, GetPlayerPhotoQueryRequestSchema);
  if (params instanceof NextResponse) {
    // error
    return params;
  }
  return getPlayerPhotoHandler(params);
}
