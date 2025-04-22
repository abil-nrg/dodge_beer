import { NextRequest, NextResponse } from "next/server";
import { tempHandler } from "@/backend/controllers/tempController";

export async function GET(req: NextRequest) {
  console.log("GET request to /api/temp");
  return tempHandler(req);
}
