import { createTeamHandler } from "@/backend/controllers/gameObjectController";
import { CreateTeamSchema } from "@/backend/config/types";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";

// POST: Add a new team
export const POST = standardPostRequestHandler({
  schema: CreateTeamSchema,
  handler: createTeamHandler,
});
