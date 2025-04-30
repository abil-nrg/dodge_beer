import { z } from "zod";
import { PlayerSchema } from "@/types/player";
import { TeamSchema } from "@/types/team";

// CONSTANT VALUES
export const MainDataConfig = {
  DATA_FILE: "data.json",
  PLAYER: "player",
  PLAYERS: "players",
  TEAM: "team",
  TEAMS: "teams",
  DEFAULT_PHOTO: "default.jpg",
  EMPTY_DATA_FILE: {
    player_count: 0,
    team_count: 0,
    game_count: 0,
    players: {},
    teams: {},
  },
  EMPTY_GAME_FILE: {},
};

// MAIN DATA FILE STRCTURE

export const MainDataSchema = z.object({
  player_count: z.number(),
  team_count: z.number(),
  game_count: z.number(),
  players: z.record(PlayerSchema),
  teams: z.record(TeamSchema),
});

export type MainDataType = z.infer<typeof MainDataSchema>;
