import { NextRequest, NextResponse } from "next/server";
import { getPlayerByIdHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";
import { verifyQueryParams } from "@/app/api/middleware/requestHandler";
import { GetPlayerByIdRequestSchema } from "@/types/api";

export async function GET(req: NextRequest) {
  const params = verifyQueryParams(req, GetPlayerByIdRequestSchema);
  if (params instanceof NextResponse) {
    // error
    return params;
  }
  return getPlayerByIdHandler(params);
}
