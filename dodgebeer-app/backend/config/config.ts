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
type Player = {
  name: string;
  player_id: string;
  photo: string;
};
type Team = {
  team_name: string;
  players: Player[];
};

type MAIN_DATA_FILE_TYPE = {
  player_count: number;
  team_count: number;
  game_count: number;
  players: { [key: string]: Player };
  teams: { [key: string]: Team };
};

export type { Player, Team, MAIN_DATA_FILE_TYPE };
