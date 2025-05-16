import { z } from "zod";

// CONSTANT VALUES
export const MainDataConfig = {
  DATA_FILE: "data.json",
  PLAYER: "player",
  PLAYERS: "players",
  TEAM: "team",
  TEAMS: "teams",
  DEFAULT_PHOTO: "default.jpg",
  UPLOAD_FOLDER: "/uploads",
  EMPTY_DATA_FILE: {
    player_count: 0,
    team_count: 0,
    game_count: 0,
    players: {},
    teams: {},
  },
};

/**
 * PLAYER SCHEMA OBJECT
 */
export const PlayerSchema = z.object({
  name: z.string(),
  photo: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;

/**
 * TEAM SCHEMA OBJECT
 */
export const TeamSchema = z.object({
  team_name: z.string(),
  players: z.array(z.string()),
});

export type Team = z.infer<typeof TeamSchema>;

/**
 * MAIN DATA FILE STRCUTURE
 */
export const MainDataSchema = z.object({
  player_count: z.number(),
  team_count: z.number(),
  game_count: z.number(),
  players: z.record(PlayerSchema),
  teams: z.record(TeamSchema),
});

export type MainDataType = z.infer<typeof MainDataSchema>;
