import { NextRequest, NextResponse } from "next/server";
import {
  gameHitClickedHandler,
  gamePlayerIsDone,
} from "@backend/controllers/GameObjectController";

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
  const player_id = searchParams.get("player_id");

  if (!player_id) {
    return NextResponse.json(
      {
        error: "Missing required query parameter(s):  player_id",
      },
      { status: 400 },
    );
  }

  return gamePlayerIsDone(game_id, player_id);
}
