import { getAllTeamsHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";

// GET: Fetch all teams
export async function GET() {
  return getAllTeamsHandler();
}
