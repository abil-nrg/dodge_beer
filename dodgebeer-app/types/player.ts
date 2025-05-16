import { z } from "zod";
import { MainDataSchema, PlayerSchema } from "@/types/main-data";

/**
 * PLAYER OBJECT WITH ID AND OTHER PROPERTIES
 */
export const PlayerWithIdSchema = z.object({
  player_id: z.string(),
  player: PlayerSchema,
});

export type PlayerWithId = z.infer<typeof PlayerWithIdSchema>;

//-----------------------------------------------------------------------------//

/**
 * GET ALL PLAYERS RESPONSE
 */
export const GetAllPlayersResponseSchema = MainDataSchema.pick({
  player_count: true,
  players: true,
});

export type GetAllPlayersResponse = z.infer<typeof GetAllPlayersResponseSchema>;

//-----------------------------------------------------------------------------//

/**
 * PLAYER ID REQUEST SCHEMA
 */
export const PlayerIdRequestSchema = z.object({
  player_id: z.string(),
});

export type PlayerIdRequest = z.infer<typeof PlayerIdRequestSchema>;

//-----------------------------------------------------------------------------//

/**
 * GET PLAYER BY ID
 */
export const GetPlayerByIdRequestSchema = PlayerIdRequestSchema.pick({
  player_id: true,
});
export type GetPlayerByIdRequest = z.infer<typeof GetPlayerByIdRequestSchema>;
export type GetPlayerByIdResponse = z.infer<typeof PlayerSchema>;

//-----------------------------------------------------------------------------//

/**
 * CREATE PLAYER REQUEST
 */
export const CreatePlayerRequestSchema = z.object({
  player_name: z.string().min(1),
  player_photo: z.string().optional(),
});
export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>;

//-----------------------------------------------------------------------------//

/**
 * CREATE PLAYER RESPONSE
 */

export const CreatePlayerResponseSchema = z.object({
  player_key: z.string().min(1),
});
export type CreatePlayerResponse = z.infer<typeof CreatePlayerResponseSchema>;

//-----------------------------------------------------------------------------//

/**
 * DELETE PLAYER REQUEST
 */
export const DeletePlayerRequestSchema = z.object({
  player_id: z.string().min(1),
});
export type DeletePlayerRequest = z.infer<typeof DeletePlayerRequestSchema>;

/**
 * GET AVAILABLE PEOPLE (NOT IN TEAM)
 */
export type GetPlayerNotInTeamResponse = PlayerWithId[];

//-----------------------------------------------------------------------------//

/**
 * DELETE PLAYER REQUEST
 */
export const UploadPlayerPhotoRequestSchema = z.object({
  photo: z.string().min(1),
});
export type UploadPlayerPhotoRequest = z.infer<
  typeof UploadPlayerPhotoRequestSchema
>;
