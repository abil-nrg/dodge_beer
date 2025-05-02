import { getAllPlayersHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";

// GET: Fetch all players
export async function GET() {
  return getAllPlayersHandler();
}
