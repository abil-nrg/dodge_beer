import { NextRequest, NextResponse } from "next/server";
import { gameSaveClickedHandler } from "@backend/controllers/GameObjectController";

interface Props {
  params: Promise<{ game_id: string }>;
}

/**
 * GET handler for registering a game hit.
 * Validates query parameters before invoking the handler.
 */
export async function GET(req: NextRequest, { params }: Props) {
  const { game_id } = await params;

  const searchParams = req.nextUrl.searchParams;
  const team_id = searchParams.get("team_id");
  const player_id = searchParams.get("player_id");
  const timeStr = searchParams.get("time");
  const time = timeStr ? Number(timeStr) : undefined;

  if (!team_id || !player_id) {
    return NextResponse.json(
      {
        error: "Missing required query parameter(s): team_id and/or player_id",
      },
      { status: 400 },
    );
  }

  return gameSaveClickedHandler(game_id, team_id, player_id, time);
}
