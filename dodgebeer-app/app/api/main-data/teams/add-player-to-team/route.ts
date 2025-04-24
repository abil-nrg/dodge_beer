import { addPlayerToTeamHandler } from "@backend/controllers/gameObjectController";
import { ChangePlayerStatusInTeamSchema } from "@backend/config/types";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";

// POST: Add new player to the team
export const POST = standardPostRequestHandler({
  schema: ChangePlayerStatusInTeamSchema,
  handler: addPlayerToTeamHandler,
});
