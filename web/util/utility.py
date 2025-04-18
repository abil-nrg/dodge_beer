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

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in CONSTANTS.ALLOWED_PHOTO_EXTENSIONS

    @staticmethod
    def check_if_need_to_flip_team_side(team_side, action):
        if team_side == CONSTANTS.ATTACK and action == CONSTANTS.SAVE:
            return Utility.flip_team_side(team_side)

        if team_side == CONSTANTS.DEFENCE and action == CONSTANTS.HIT:
            return Utility.flip_team_side(team_side)

        return team_side  # don't flip

    @staticmethod
    def flip_team_side(team_side: str):
        return CONSTANTS.ATTACK if team_side == CONSTANTS.DEFENCE \
            else CONSTANTS.DEFENCE

    @staticmethod
    def flip_both_team_sides(team_sides: dict):
        new_team_sides = {}
        for team_num, side in team_sides.items():
            new_team_sides[team_num] = CONSTANTS.ATTACK if side == CONSTANTS.DEFENCE\
                                                        else CONSTANTS.DEFENCE
        return new_team_sides
    
    @staticmethod
    def translate_team_num_to_key_in_game(game:dict, teamname: str):
        
        for key, value in game.items():
            if value == teamname:
                return key
        return None  # If not found