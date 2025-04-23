import { createTeamHandler } from "@/backend/controllers/gameObjectController";
import { NextRequest, NextResponse } from "next/server";
import { CreateTeamSchema } from "@/backend/config/types";
import { validate } from "../../middleware/validator";

// POST: Add a new team
export async function POST(req: NextRequest) {
  let json: unknown;

  try {
    json = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = CreateTeamSchema.safeParse(json);

  const validationError = validate(result);
  if (validationError || !result.data) {
    return NextResponse.json(validationError);
  }
  return createTeamHandler(result.data);
}
