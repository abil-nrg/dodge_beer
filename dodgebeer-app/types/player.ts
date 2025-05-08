import { z } from "zod";

// Main Object
export const PlayerSchema = z.object({
  name: z.string(),
  photo: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;

// ---------
// Player Unique Id
export const PlayerIdRequestSchema = z.object({
  player_id: z.string(),
});

export type PlayerIdRequest = z.infer<typeof PlayerIdRequestSchema>;

/* CREATE PLAYER REQUEST AND RESPONSE */
export const CreatePlayerRequestSchema = z.object({
  player_name: z.string().min(1),
  player_photo: z.string().optional(),
});

export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>;

export const CreatePlayerResponseSchema = z.object({
  player_key: z.string().min(1),
});
export type CreatePlayerResponse = z.infer<typeof CreatePlayerResponseSchema>;

/* DELETE PLAYER REQUEST AND RESPONSE */
export const DeletePlayerRequestSchema = z.object({
  player_id: z.string().min(1),
});

export type DeletePlayerRequest = z.infer<typeof DeletePlayerRequestSchema>;
