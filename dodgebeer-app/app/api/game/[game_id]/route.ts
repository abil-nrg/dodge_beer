import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { game_id: string } },
) {
  const { game_id } = params;
  // TODO:
}
