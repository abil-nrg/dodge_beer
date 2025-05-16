import { createGameHandler } from "@backend/controllers/GameObjectController";
import { CreateGameRequest } from "@/types/game-api";

export async function POST(req: Request) {
  const body = (await req.json()) as CreateGameRequest;
  return createGameHandler(body);
}
