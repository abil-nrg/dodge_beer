import { getAllAvailablePlayersHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";

export async function GET() {
  return getAllAvailablePlayersHandler();
}
