import { createTeamHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { CreateTeamSchema } from "@/types/team";

// POST: Add a new team
export const POST = standardPostRequestHandler({
  schema: CreateTeamSchema,
  handler: createTeamHandler,
});
