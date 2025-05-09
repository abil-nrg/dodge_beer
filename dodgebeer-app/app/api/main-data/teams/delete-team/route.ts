import { deleteTeamHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { DeleteTeamRequestSchema } from "@/types/team";

// POST: Delete player
export const POST = standardPostRequestHandler({
  schema: DeleteTeamRequestSchema,
  handler: deleteTeamHandler,
});
