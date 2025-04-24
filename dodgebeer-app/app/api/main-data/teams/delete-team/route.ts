import { deleteTeam } from "@/backend/controllers/gameObjectController";
import { DeleteTeamSchema } from "@/backend/config/types";
import { standardPostRequestHandler } from "@/app/api/middleware/requestHandler";

// POST: Delete player
export const POST = standardPostRequestHandler({
  schema: DeleteTeamSchema,
  handler: deleteTeam,
});
