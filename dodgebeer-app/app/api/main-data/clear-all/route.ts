import { clearMainDataHandler } from "@backend/controllers/PlayerAndTeamObjectRetrieveController";

// POST: Clear main data
export async function POST() {
  return clearMainDataHandler();
}
