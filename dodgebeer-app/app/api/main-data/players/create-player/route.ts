import { createPlayerHandler } from "@/backend/controllers/gameObjectController";
import { CreatePlayerSchema } from "@/backend/config/types";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";

// POST: Add a new player
export const POST = standardPostRequestHandler({
  schema: CreatePlayerSchema,
  handler: createPlayerHandler,
});
