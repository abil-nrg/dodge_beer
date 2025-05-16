import { NextRequest, NextResponse } from "next/server";
import {
  getGameStatusHandler,
  getPlayerStatsHandler,
} from "@backend/controllers/GameObjectController";

interface Props {
  params: {
    game_id: string;
  };
}

export async function GET(req: NextRequest, { params }: Props) {
  const { game_id } = await params;

  return getPlayerStatsHandler(game_id);
}
