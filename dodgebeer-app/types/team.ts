import { z } from "zod";
import { MainDataSchema } from "@/types/main-data";

/**
 * TEAM SCHEMA OBJECT
 */
export const TeamSchema = z.object({
  team_name: z.string(),
  players: z.array(z.string()),
});

export type Team = z.infer<typeof TeamSchema>;

//-----------------------------------------------------------------------------//

/**
 * GET ALL TEAMS RESPONSE
 */
export const GetAllTeamsResponseSchema = MainDataSchema.pick({
  team_count: true,
  teams: true,
});

export type GetAllTeamsResponse = z.infer<typeof GetAllTeamsResponseSchema>;

//-----------------------------------------------------------------------------//

/**
 * CREATE TEAM REQUEST
 */
export const CreateTeamSchema = z.object({
  team_name: z.string().min(1),
});
export type CreateTeamRequest = z.infer<typeof CreateTeamSchema>;

/**
 * CREATE TEAM RESPONSE
 */
export const CreateTeamResponseSchema = z.object({
  team_key: z.string().min(1),
});
export type CreateTeamResponse = z.infer<typeof CreateTeamResponseSchema>;

//-----------------------------------------------------------------------------//

/**
 * CHANGE PLAYER STATUS IN TEAM (Add or Remove) - REQUEST
 */
export const ChangePlayerStatusInTeamRequestSchema = z.object({
  team_id: z.string().min(1),
  player_id: z.string().min(1),
});
export type ChangePlayerStatusInTeamRequest = z.infer<
  typeof ChangePlayerStatusInTeamRequestSchema
>;

/**
 * CHANGE PLAYER STATUS IN TEAM (Add or Remove) - RESPONSE
 */
export const ChangePlayerStatusInTeamResponseSchema = z.object({
  player_key: z.string().min(1),
});
export type ChangePlayerStatusInTeamResponse = z.infer<
  typeof ChangePlayerStatusInTeamResponseSchema
>;

//-----------------------------------------------------------------------------//

/**
 * DELETE TEAM REQUEST
 */
export const DeleteTeamRequestSchema = z.object({
  team_id: z.string().min(1),
});
export type DeleteTeamRequest = z.infer<typeof DeleteTeamRequestSchema>;

/**
 * DELETE TEAM OR PLAYER RESPONSE
 */
export const DeleteTeamOrPlayerResponseSchema = z.object({
  isDeleted: z.boolean().default(false),
});
export type DeleteTeamOrPlayerResponse = z.infer<
  typeof DeleteTeamOrPlayerResponseSchema
>;
