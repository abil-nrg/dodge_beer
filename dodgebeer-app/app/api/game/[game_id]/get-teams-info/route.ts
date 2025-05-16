import { getTeamInfoForGameHandler } from "@backend/controllers/GameObjectController";
import { NextRequest } from "next/server";

interface Props {
  params: Promise<{ game_id: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  const { game_id } = await params;
  return getTeamInfoForGameHandler(game_id);
}
