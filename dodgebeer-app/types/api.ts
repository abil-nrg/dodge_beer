import { z } from "zod";
import { MainDataSchema } from "@/types/main-data";
import { PlayerIdRequestSchema, PlayerSchema } from "@/types/player";

export const OK_RESPONSE_JSON = {
  status: 200,
  headers: { "Content-Type": "application/json" },
};

export const BAD_REQUEST_JSON = {
  status: 400,
  headers: { "Content-Type": "application/json" },
};

export const INTERNAL_ERROR = {
  status: 500,
};

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

/* GET Player By ID */
export const GetPlayerByIdRequestSchema = PlayerIdRequestSchema.pick({
  player_id: true,
});

export type GetPlayerByIdRequest = z.infer<typeof GetPlayerByIdRequestSchema>;

/* GET Player Photo */
export const GetPlayerPhotoQueryRequestSchema = PlayerIdRequestSchema.pick({
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
