import {
  getAllPlayersHandler,
  getAllTeamsHandler,
} from "@/backend/controllers/getterObjectController";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all teams
export async function GET() {
  return getAllPlayersHandler();
}
