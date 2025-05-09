import { addPlayerToTeamHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { ChangePlayerStatusInTeamRequestSchema } from "@/types/team";

// POST: Add new player to the team
export const POST = standardPostRequestHandler({
  schema: ChangePlayerStatusInTeamRequestSchema,
  handler: addPlayerToTeamHandler,
});
