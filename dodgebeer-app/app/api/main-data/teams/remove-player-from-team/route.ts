import { removePlayerToTeamHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { ChangePlayerStatusInTeamRequestSchema } from "@/types/team";

// POST: Remove player from team
export const POST = standardPostRequestHandler({
  schema: ChangePlayerStatusInTeamRequestSchema,
  handler: removePlayerToTeamHandler,
});
