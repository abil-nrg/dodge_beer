const API = "/api";
const MAIN_DATA_API = API + "/main-data";
const PLAYERS = "/players";
const TEAMS = "/teams";

export const API_ROUTE = {
  API,
  // MAIN DATA FILE
  MAIN_DATA_API,
  CLEAR_MAIN_DATA: `${MAIN_DATA_API}/clear-all`,
  GET_MAIN_DATA: `${MAIN_DATA_API}/get-all`,
  // PLAYER ROUTES
  GET_ALL_PLAYERS: `${MAIN_DATA_API}${PLAYERS}`,
  CREATE_PLAYER: `${MAIN_DATA_API}${PLAYERS}/create-player`,
  DELETE_PLAYER: `${MAIN_DATA_API}${PLAYERS}/delete-player`,
  GET_PLAYER_IMAGE: `${MAIN_DATA_API}${PLAYERS}/get-player-image`,
  // TEAM ROUTES
  GET_ALL_TEAMS: `${MAIN_DATA_API}${TEAMS}`,
  CREATE_TEAM: `${MAIN_DATA_API}${TEAMS}/create-team`,
  DELETE_TEAM: `${MAIN_DATA_API}${TEAMS}/delete-team`,
  ADD_PLAYER_TO_TEAM: `${MAIN_DATA_API}${TEAMS}/add-player-to-team`,
  REMOVE_PLAYER_FROM_TEAM: `${MAIN_DATA_API}${TEAMS}/remove-player-from-team`,
};
