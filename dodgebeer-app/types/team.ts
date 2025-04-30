import { z } from "zod";

export const TeamSchema = z.object({
  team_name: z.string(),
  players: z.array(z.string()),
});

export type Team = z.infer<typeof TeamSchema>;

// Create Team Request
export const CreateTeamSchema = z.object({
  team_name: z.string().min(1),
});
export type CreateTeamRequest = z.infer<typeof CreateTeamSchema>;

// Add or Remove Player to/from Team
export const ChangePlayerStatusInTeamSchema = z.object({
  team_id: z.string().min(1),
  player_id: z.string().min(1),
});
export type ChangePlayerStatusInTeamRequest = z.infer<
  typeof ChangePlayerStatusInTeamSchema
>;

// DELETE TEAM
export const DeleteTeamSchema = z.object({
  team_id: z.string().min(1),
});

export type DeleteTeamRequest = z.infer<typeof DeleteTeamSchema>;
