import { clearMainData } from "@/backend/controllers/getterObjectController";

// GET: Fetch main data
export async function POST() {
  return clearMainData();
}
