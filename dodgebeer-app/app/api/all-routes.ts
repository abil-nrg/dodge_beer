import {
  ChangePlayerStatusInTeamRequest,
  CreateTeamRequest,
  DeleteTeamRequest,
} from "@/types/team";
import { CreatePlayerRequest, DeletePlayerRequest } from "@/types/player";
import { CreateGameRequest } from "@/types/game-api";

const API = "/api";
const MAIN_DATA_API = API + "/main-data";
const PLAYERS = "/players";
const TEAMS = "/teams";
const GAME_DATA_API = API + "/game";

const API_ROUTE = {
  API,
  // MAIN DATA FILE
  MAIN_DATA_API,
  CLEAR_MAIN_DATA: `${MAIN_DATA_API}/clear-all`,
  GET_MAIN_DATA: `${MAIN_DATA_API}/get-all`,
  // PLAYER ROUTES
  GET_ALL_PLAYERS: `${MAIN_DATA_API}${PLAYERS}`,
  GET_PLAYER_BY_ID: `${MAIN_DATA_API}${PLAYERS}/get-player`,
  CREATE_PLAYER: `${MAIN_DATA_API}${PLAYERS}/create-player`,
  DELETE_PLAYER: `${MAIN_DATA_API}${PLAYERS}/delete-player`,
  GET_PLAYER_NOT_IN_TEAM: `${MAIN_DATA_API}${PLAYERS}/getPlayersNotInTeam`,
  UPLOAD_PHOTO: `${MAIN_DATA_API}${PLAYERS}/upload-image`,

  // TEAM ROUTES
  GET_ALL_TEAMS: `${MAIN_DATA_API}${TEAMS}`,
  CREATE_TEAM: `${MAIN_DATA_API}${TEAMS}/create-team`,
  DELETE_TEAM: `${MAIN_DATA_API}${TEAMS}/delete-team`,
  ADD_PLAYER_TO_TEAM: `${MAIN_DATA_API}${TEAMS}/add-player-to-team`,
  REMOVE_PLAYER_FROM_TEAM: `${MAIN_DATA_API}${TEAMS}/remove-player-from-team`,

  //GAME ROUTES
  CREATE_GAME: `${GAME_DATA_API}/create-game`,
  GET_TEAMS_INFO_PATH: "/get-teams-info",
  GAME_PLAYER_HIT_PATH: "/player-hit",
  GAME_PLAYER_SAVE_PATH: "/player-save",
  GAME_GET_STATUS: "/get-game-status",
  GAME_ADD_PLAYER_DONE: "/add-player-done",
  GAME_PLAYERS_STATS: "/get-players-stats",
};

interface AddQueryParamToUrnProps {
  base: string;
  params: Record<string, string | number | undefined>;
}

const JSON_HEADER = {
  "Content-Type": "application/json",
};

export class ApiClient {
  static #AddQueryParamToUrn({
    base,
    params,
  }: AddQueryParamToUrnProps): string {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";

    const url = new URL(base, origin);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    return url.toString();
  }

  static GetAllTeamsRoute() {
    return fetch(API_ROUTE.GET_ALL_TEAMS, { method: "GET" });
  }

  static GetPLayerByIdRoute(id: string) {
    const urn = this.#AddQueryParamToUrn({
      base: API_ROUTE.GET_PLAYER_BY_ID,
      params: {
        player_id: id,
      },
    });

    return fetch(urn, {
      method: "GET",
    });
  }

  static removePlayerFromTeamRoute(playerId: string, teamId: string) {
    return fetch(API_ROUTE.REMOVE_PLAYER_FROM_TEAM, {
      method: "POST",
      body: JSON.stringify({
        player_id: playerId,
        team_id: teamId,
      } as ChangePlayerStatusInTeamRequest),
      headers: JSON_HEADER,
    });
  }

  static deleteTeamRoute(team_id: string) {
    return fetch(API_ROUTE.DELETE_TEAM, {
      method: "POST",
      body: JSON.stringify({
        team_id: team_id,
      } as DeleteTeamRequest),
      headers: JSON_HEADER,
    });
  }
  static getPlayersNotInTeamRoute() {
    return fetch(API_ROUTE.GET_PLAYER_NOT_IN_TEAM, {
      method: "GET",
    });
  }

  static addNewPlayerToTeamRoute(teamId: string, playerId: string) {
    return fetch(API_ROUTE.ADD_PLAYER_TO_TEAM, {
      method: "POST",
      headers: JSON_HEADER,
      body: JSON.stringify({
        player_id: playerId,
        team_id: teamId,
      } as ChangePlayerStatusInTeamRequest),
    });
  }

  static createTeamRoute(teamName: string) {
    return fetch(API_ROUTE.CREATE_TEAM, {
      method: "POST",
      headers: JSON_HEADER,
      body: JSON.stringify({
        team_name: teamName,
      } as CreateTeamRequest),
    });
  }

  static getAllPlayersRoute() {
    return fetch(API_ROUTE.GET_ALL_PLAYERS, {
      method: "GET",
    });
  }

  static deletePlayerRoute(id: string) {
    return fetch(API_ROUTE.DELETE_PLAYER, {
      method: "POST",
      headers: JSON_HEADER,
      body: JSON.stringify({ player_id: id } as DeletePlayerRequest),
    });
  }

  static addNewPlayerRoute(player_name: string, photo?: string) {
    const body = {
      player_name: player_name,
      player_photo: photo,
    };

    return fetch(API_ROUTE.CREATE_PLAYER, {
      method: "POST",
      headers: JSON_HEADER,
      body: JSON.stringify(body as CreatePlayerRequest),
    });
  }

  static uploadPhotoRoute(formData: FormData) {
    return fetch(API_ROUTE.UPLOAD_PHOTO, {
      method: "POST",
      body: formData,
    });
  }

  static createGameRoute(team1: string, team2: string) {
    return fetch(API_ROUTE.CREATE_GAME, {
      method: "POST",
      headers: JSON_HEADER,
      body: JSON.stringify({ team1: team1, team2: team2 } as CreateGameRequest),
    });
  }

  static getGamePagePath(gameId: string) {
    return `${GAME_DATA_API}/${gameId}`;
  }

  static getBothTeamsInfoByGameIdRoute(gameId: string) {
    const path =
      ApiClient.getGamePagePath(gameId) + API_ROUTE.GET_TEAMS_INFO_PATH;
    return fetch(path, { method: "GET" });
  }

  static playerHitInGameRoute(
    gameId: string,
    team_id: string,
    player_id: string,
    time?: number,
  ) {
    const path =
      ApiClient.getGamePagePath(gameId) + API_ROUTE.GAME_PLAYER_HIT_PATH;

    const url = this.#AddQueryParamToUrn({
      base: path,
      params: { team_id, player_id, time },
    });

    return fetch(url, { method: "GET" });
  }
  static playerSaveInGameRoute(
    gameId: string,
    team_id: string,
    player_id: string,
    time?: number,
  ) {
    const path =
      ApiClient.getGamePagePath(gameId) + API_ROUTE.GAME_PLAYER_SAVE_PATH;

    const url = this.#AddQueryParamToUrn({
      base: path,
      params: { team_id, player_id, time },
    });

    return fetch(url, { method: "GET" });
  }

  static getGameStatusRoute(gameId: string) {
    const path = ApiClient.getGamePagePath(gameId) + API_ROUTE.GAME_GET_STATUS;

    return fetch(path, { method: "GET" });
  }

  static addPlayerIsDoneRoute(gameId: string, player_id: string) {
    const path =
      ApiClient.getGamePagePath(gameId) + API_ROUTE.GAME_ADD_PLAYER_DONE;

    const url = this.#AddQueryParamToUrn({
      base: path,
      params: { player_id },
    });

    return fetch(url, { method: "GET" });
  }

  static getPlayerStatsRoute(gameId: string) {
    const path =
      ApiClient.getGamePagePath(gameId) + API_ROUTE.GAME_PLAYERS_STATS;

    return fetch(path, { method: "GET" });
  }
}
