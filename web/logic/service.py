from web.util.utility import Utility
from web.util.constants import CONSTANTS


class Service:

    @staticmethod
    def increment_player_count_and_return_data():
        return Service.increment_count_of_data_json(CONSTANTS.DATA_JSON_PLAYER_SEQ)

    @staticmethod
    def increment_team_count_and_return_data():
        return Service.increment_count_of_data_json(CONSTANTS.DATA_JSON_TEAM_SEQ)

    @staticmethod
    def increment_game_count_and_return_data():
        return Service.increment_count_of_data_json(CONSTANTS.DATA_JSON_GAME_SEQ)

    @staticmethod
    def increment_count_of_data_json(json_field_key: str):
        data: dict = Utility.load_json(CONSTANTS.DATA_JSON_FILE)
        cur_count: int = data[json_field_key]
        new_count: int = cur_count + 1
        data[json_field_key] = new_count
        return data, new_count

    @staticmethod
    def create_player(name: str):
        data, player_num = Service.increment_player_count_and_return_data()
        data[CONSTANTS.DATA_JSON_PLAYER_KEY][CONSTANTS.PLAYER_KEY + str(player_num)] = name
        Utility.write_json_data(CONSTANTS.DATA_JSON_FILE, data)

    @staticmethod
    def create_team(team_name: str, *player_names: str):
        data, team_num = Service.increment_team_count_and_return_data()
        team_players = Utility.create_array_of_playerX(data[CONSTANTS.DATA_JSON_PLAYER_KEY], *player_names)
        new_team_dict: dict = {CONSTANTS.DATA_JSON_TEAM_NAME_KEY: team_name,
                               CONSTANTS.DATA_JSON_TEAM_PLAYERS_KEY: team_players}

        all_teams: dict = data[CONSTANTS.DATA_JSON_TEAM_KEY]
        all_teams[CONSTANTS.TEAM_KEY + str(team_num)] = new_team_dict
        data[CONSTANTS.DATA_JSON_TEAM_KEY] = all_teams
        Utility.write_json_data(CONSTANTS.DATA_JSON_FILE, data)

    @staticmethod
    def create_game(*team_names: str):
        data, game_num = Service.increment_game_count_and_return_data()
        team_keys: list = Utility.map_team_names_to_team_keys(data[CONSTANTS.DATA_JSON_TEAM_KEY],
                                                              *team_names)
        game_data = Utility.create_game_file_base_data(team_keys)
        game_file_path = Utility.create_game_file_path(game_num)
        Utility.write_json_data(game_file_path, game_data)
        Utility.write_json_data(CONSTANTS.DATA_JSON_FILE, data)



