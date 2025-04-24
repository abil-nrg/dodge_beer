import { getAllTeamsHandler } from "@/backend/controllers/getterObjectController";

// GET: Fetch all teams
export async function GET() {
  return getAllTeamsHandler();
}
