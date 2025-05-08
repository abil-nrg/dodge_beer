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
export const GetAllPlayersResponseSchema = MainDataSchema.pick({
  player_count: true,
  players: true,
});

export type GetAllPlayersResponse = z.infer<typeof GetAllPlayersResponseSchema>;

/* GET Player By ID Request and Response */
export const GetPlayerByIdRequestSchema = PlayerIdRequestSchema.pick({
  player_id: true,
});

export type GetPlayerByIdRequest = z.infer<typeof GetPlayerByIdRequestSchema>;

export type GetPlayerByIdResponse = z.infer<typeof PlayerSchema>;
