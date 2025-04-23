/**
 * Request Interfaces
 */

import { z } from "zod";
import { MainDataSchema, PlayerSchema } from "./config";

// Create Player Request
export const CreatePlayerSchema = z.object({
  player_name: z.string().min(1),
  player_photo: z.string().optional(),
});
export type CreatePlayerRequest = z.infer<typeof CreatePlayerSchema>;

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

/**
 * Response Interfaces
 */

export const GetAllTeamsSchema = MainDataSchema.pick({
  team_count: true,
  teams: true,
});

export type GetAllTeamsResponse = z.infer<typeof GetAllTeamsSchema>;

export const GetAllPlayersSchema = MainDataSchema.pick({
  player_count: true,
  players: true,
});

export type GetAllPlayersResponse = z.infer<typeof GetAllPlayersSchema>;
