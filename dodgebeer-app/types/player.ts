import { z } from "zod";

export const PlayerSchema = z.object({
  name: z.string(),
  photo: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;

// ---------

export const PlayerIdRequestSchema = z.object({
  player_id: z.string(),
});

export type PlayerIdRequest = z.infer<typeof PlayerIdRequestSchema>;

export const CreatePlayerRequestSchema = z.object({
  player_name: z.string().min(1),
  player_photo: z.string().optional(),
});

export type CreatePlayerRequest = z.infer<typeof CreatePlayerRequestSchema>;

// DELETE PLAYER
export const DeletePlayerRequestSchema = z.object({
  player_id: z.string().min(1),
});

export type DeletePlayerRequest = z.infer<typeof DeletePlayerRequestSchema>;
