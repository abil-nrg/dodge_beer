import { z } from "zod";

// CONSTANT VALUES
const Config = {
  DATA_FILE: "data",
  STAT_FILE: "stats",
  GAME_FILE: "game",
  PLAYER_KEY: "player",
  TEAM_KEY: "team",
  DEFAULT_PHOTO: "default.jpg",
  EMPTY_DATA_FILE: {
    player_count: 0,
    team_count: 0,
    game_count: 0,
    players: {},
    teams: {},
  },
};

export default Config;

// MAIN DATA FILE STRCTURE
export const PlayerSchema = z.object({
  name: z.string(),
  photo: z.string(),
});

export type Player = z.infer<typeof PlayerSchema>;

export const TeamSchema = z.object({
  team_name: z.string(),
  players: z.array(PlayerSchema),
});

export type Team = z.infer<typeof TeamSchema>;

export const MainDataSchema = z.object({
  player_count: z.number(),
  team_count: z.number(),
  game_count: z.number(),
  players: z.record(PlayerSchema),
  teams: z.record(TeamSchema),
});

export type MainDataType = z.infer<typeof MainDataSchema>;
