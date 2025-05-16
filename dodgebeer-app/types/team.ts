import { z } from "zod";
import { MainDataSchema, TeamSchema } from "@/types/main-data";
import { PlayerObject } from "@/types/player";

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
export const ChangePlayerStatusInTeamResponseSchema = TeamSchema.pick({
  players: true,
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

//-----------------------------------------------------------------------------//
export type TeamObject = {
  team_id: string;
  team_name: string;
  players: string[];
};

export type FullTeamObject = {
  team: TeamObject;
  players: PlayerObject[];
};

export type GetBothTeamsResponse = {
  team1: FullTeamObject;
  team2: FullTeamObject;
};
