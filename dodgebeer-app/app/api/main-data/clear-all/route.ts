import { clearMainData } from "@/backend/controllers/getterObjectController";

// GET: Clear main data
export async function POST() {
  return clearMainData();
}
