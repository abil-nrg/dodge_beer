import { NextRequest, NextResponse } from "next/server";
import { getGameStatusHandler } from "@backend/controllers/GameObjectController";

interface Props {
  params: Promise<{ game_id: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  const { game_id } = await params;

  return getGameStatusHandler(game_id);
}
