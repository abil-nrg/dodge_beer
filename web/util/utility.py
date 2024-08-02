import json
from web.util.constants import CONSTANTS


class Utility:

    @staticmethod
    def write_json_data(file_path, data):
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)

    @staticmethod
    def load_json(file) -> dict:
        with open(file, "r") as f:
            data = json.load(f)
            return data

    @staticmethod
    def create_game_file_path(game_num):
        return CONSTANTS.BASE_GAME_FILE_PATH + str(game_num) + ".json"

    @staticmethod
    def create_game_file_base_data(team_keys) -> dict:
        return {"team1": team_keys[0], "team2": team_keys[1], CONSTANTS.GAME_JSON_ROUND_COUNT: 0}

    @staticmethod
    def create_array_of_playerX(players: dict, *player_names):
        reverse_lookup = {val: key for key, val in players.items()}  # reverse player dict
        return [reverse_lookup[player_name] for player_name in player_names if player_name in reverse_lookup]

    @staticmethod
    def map_team_names_to_team_keys(teams: dict, *team_names):
        reverse_lookup = {team[CONSTANTS.DATA_JSON_TEAM_NAME_KEY]: key for key, team in teams.items()}
        return [reverse_lookup[team_name] for team_name in team_names if team_name in reverse_lookup]

