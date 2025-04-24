import { getMainData } from "@/backend/controllers/getterObjectController";

// GET: Fetch main data
export async function GET() {
  return getMainData();
}
