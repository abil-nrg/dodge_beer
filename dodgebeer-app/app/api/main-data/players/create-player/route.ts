import { createPlayerHandler } from "@backend/controllers/PlayerAndTeamObjectMutationController";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";
import { CreatePlayerRequestSchema } from "@/types/player";

// POST: Add a new player
export const POST = standardPostRequestHandler({
  schema: CreatePlayerRequestSchema,
  handler: createPlayerHandler,
});
