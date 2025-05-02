import { deletePlayerHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { DeletePlayerRequestSchema } from "@/types/player";

// POST: Delete player
export const POST = standardPostRequestHandler({
  schema: DeletePlayerRequestSchema,
  handler: deletePlayerHandler,
});
