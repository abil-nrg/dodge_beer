import { addPlayerToTeamHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { ChangePlayerStatusInTeamSchema } from "@/types/team";

// POST: Add new player to the team
export const POST = standardPostRequestHandler({
  schema: ChangePlayerStatusInTeamSchema,
  handler: addPlayerToTeamHandler,
});
