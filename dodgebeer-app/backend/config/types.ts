// Request Interfaces

export interface CreatePlayerRequest {
  player_name: string;
  player_photo?: string;
}

export interface CreateTeamRequest {
  team_name: string;
}

export interface ChangePlayerStatusInTeamRequest {
  team_id: string;
  player_id: string;
}
