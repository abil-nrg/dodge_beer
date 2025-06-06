import { NextRequest, NextResponse } from "next/server";
import {
  gameAllMissedHandler,
  gameSaveClickedHandler,
} from "@backend/controllers/GameObjectController";

interface Props {
  params: Promise<{ game_id: string }>;
}

/**
 * GET handler for registering all players missed.
 * Validates query parameters before invoking the handler.
 */
export async function GET(req: NextRequest, { params }: Props) {
  const { game_id } = await params;

  const searchParams = req.nextUrl.searchParams;
  const team_id = searchParams.get("team_id");

  if (!team_id) {
    return NextResponse.json(
      {
        error: "Missing required query parameter(s): team_id",
      },
      { status: 400 },
    );
  }

  return gameAllMissedHandler(game_id, team_id);
}
