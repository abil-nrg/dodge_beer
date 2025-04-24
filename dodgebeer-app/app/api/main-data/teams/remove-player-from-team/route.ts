import { removePlayerToTeamHandler } from "@/backend/controllers/gameObjectController";
import { ChangePlayerStatusInTeamSchema } from "@/backend/config/types";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";

// POST: Remove player from team
export const POST = standardPostRequestHandler({
  schema: ChangePlayerStatusInTeamSchema,
  handler: removePlayerToTeamHandler,
});
