import { deletePlayer } from "@/backend/controllers/gameObjectController";
import { DeletePlayerSchema } from "@/backend/config/types";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";

// POST: Delete player
export const POST = standardPostRequestHandler({
  schema: DeletePlayerSchema,
  handler: deletePlayer,
});
