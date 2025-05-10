import {
  ChangePlayerStatusInTeamRequest,
  DeleteTeamRequest,
} from "@/types/team";

const API = "/api";
const MAIN_DATA_API = API + "/main-data";
const PLAYERS = "/players";
const TEAMS = "/teams";

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
  GET_PLAYER_IMAGE: `${MAIN_DATA_API}${PLAYERS}/get-player-image`,
  // TEAM ROUTES
  GET_ALL_TEAMS: `${MAIN_DATA_API}${TEAMS}`,
  CREATE_TEAM: `${MAIN_DATA_API}${TEAMS}/create-team`,
  DELETE_TEAM: `${MAIN_DATA_API}${TEAMS}/delete-team`,
  ADD_PLAYER_TO_TEAM: `${MAIN_DATA_API}${TEAMS}/add-player-to-team`,
  REMOVE_PLAYER_FROM_TEAM: `${MAIN_DATA_API}${TEAMS}/remove-player-from-team`,
};

interface AddQueryParamToUrnProps {
  base: string;
  params: Record<string, string>;
}

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
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  static GetAllTeams() {
    return fetch(API_ROUTE.GET_ALL_TEAMS, { method: "GET" });
  }

  static GetPLayerById(id: string) {
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

  static removePlayerFromTeam(playerId: string, teamId: string) {
    return fetch(API_ROUTE.REMOVE_PLAYER_FROM_TEAM, {
      method: "POST",
      body: JSON.stringify({
        player_id: playerId,
        team_id: teamId,
      } as ChangePlayerStatusInTeamRequest),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static deleteTeam(team_id: string) {
    return fetch(API_ROUTE.DELETE_TEAM, {
      method: "POST",
      body: JSON.stringify({
        team_id: team_id,
      } as DeleteTeamRequest),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
