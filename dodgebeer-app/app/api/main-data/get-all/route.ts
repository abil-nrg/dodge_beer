import { getMainDataHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";

// GET: Fetch main data
export async function GET() {
  return getMainDataHandler();
}
