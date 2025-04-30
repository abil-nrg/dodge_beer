import { MainDataSchema, PlayerSchema } from "@backend/config/config";
import { z } from "zod";
import { PlayerIdSchema } from "@backend/config/types";

/* GET TEAMS */
export const GetAllTeamsResponseSchema = MainDataSchema.pick({
  team_count: true,
  teams: true,
});

export type GetAllTeamsResponse = z.infer<typeof GetAllTeamsResponseSchema>;

/* GET PLAYERS */
export const GetAllPlayersSchema = MainDataSchema.pick({
  player_count: true,
  players: true,
});

export type GetAllPlayersResponse = z.infer<typeof GetAllPlayersSchema>;

/* GET Player Photo */
export const GetPlayerPhotoQueryRequestSchema = PlayerIdSchema.pick({
  player_id: true,
});

export type GetPlayerPhotoQueryRequest = z.infer<
  typeof GetPlayerPhotoQueryRequestSchema
>;

export const GetPlayerPhotoResponseSchema = PlayerSchema.pick({
  photo: true,
});

export type GetPlayerPhotoResponse = z.infer<
  typeof GetPlayerPhotoResponseSchema
>;
