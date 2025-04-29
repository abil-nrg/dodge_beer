/**
 * Request Interfaces
 */

import { z } from "zod";
import { MainDataSchema, PlayerSchema } from "./config";

export const PlayerIdSchema = z.object({
  player_id: z.string(),
});

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

// DELETE TEAM
export const DeleteTeamSchema = z.object({
  team_id: z.string().min(1),
});

export type DeleteTeamRequest = z.infer<typeof DeleteTeamSchema>;

// DELETE PLAYER
export const DeletePlayerSchema = z.object({
  player_id: z.string().min(1),
});

export type DeletePlayerRequest = z.infer<typeof DeletePlayerSchema>;

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

/* Player Photo */
export const GetPlayerPhotoQueryRequestSchema = PlayerIdSchema.pick({
  player_id: true,
});

export type GetPlayerPhotoQueryRequest = z.infer<
  typeof GetPlayerPhotoQueryRequestSchema
>;

export const GetPlayerPhotoSchema = PlayerSchema.pick({
  photo: true,
});

export type GetPlayerPhotoResponse = z.infer<typeof GetPlayerPhotoSchema>;
