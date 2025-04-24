import { getAllPlayersHandler } from "@/backend/controllers/getterObjectController";

// GET: Fetch all players
export async function GET() {
  return getAllPlayersHandler();
}
