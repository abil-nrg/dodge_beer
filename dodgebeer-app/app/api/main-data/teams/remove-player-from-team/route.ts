import { removePlayerToTeamHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { ChangePlayerStatusInTeamSchema } from "@/types/team";

// POST: Remove player from team
export const POST = standardPostRequestHandler({
  schema: ChangePlayerStatusInTeamSchema,
  handler: removePlayerToTeamHandler,
});
