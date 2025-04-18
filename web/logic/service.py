import os.path
from typing import Tuple, Any

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
    def create_player(name: str) -> str:
        data, player_num = Service.increment_player_count_and_return_data()
        data[CONSTANTS.DATA_JSON_PLAYER_KEY][CONSTANTS.PLAYER_KEY + str(player_num)] = name
        Utility.write_json_data(CONSTANTS.DATA_JSON_FILE, data)

    @staticmethod
    def add_person_to_photo_file(name, filename):
        data = Utility.load_json(CONSTANTS.PERSON_TO_PHOTO_JSON_FILE)
        data[name] = filename
        Utility.write_json_data(CONSTANTS.PERSON_TO_PHOTO_JSON_FILE, data)

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
        return game_num

    # For app.create_team()
    @staticmethod
    def get_players_available() -> list:
        data: dict = Utility.load_json(CONSTANTS.DATA_JSON_FILE)
        all_player_keys = set(data[CONSTANTS.DATA_JSON_PLAYER_KEY].keys())
        players_in_teams = set()

        for team in data[CONSTANTS.DATA_JSON_TEAM_KEY].values():
            players_in_teams.update(team[CONSTANTS.DATA_JSON_TEAM_PLAYERS_KEY])

        players_not_in_teams = list(all_player_keys - players_in_teams)

        # not efficient but whatever
        player_names_not_in_teams = []
        all_player_names = data[CONSTANTS.DATA_JSON_PLAYER_KEY]
        for player in players_not_in_teams:
            try:
                player_names_not_in_teams.append(all_player_names[player])
            except KeyError:
                player_names_not_in_teams.append("Some Player")

        return player_names_not_in_teams

    # For app.new_game()
    @staticmethod
    def get_all_teams() -> list:
        data: dict = Utility.load_json(CONSTANTS.DATA_JSON_FILE)
        all_teams_names = []
        teams: dict = data[CONSTANTS.DATA_JSON_TEAM_KEY]
        for team_num, team_info in teams.items():
            all_teams_names.append(team_info[CONSTANTS.DATA_JSON_TEAM_NAME_KEY])

        return all_teams_names

    @staticmethod
    def get_team_info(team_name: str) -> tuple[Any, dict, Any] | tuple[None, None, None]:
        data: dict = Utility.load_json(CONSTANTS.DATA_JSON_FILE)
        all_teams: dict = data[CONSTANTS.DATA_JSON_TEAM_KEY]
        for team_num, team_info in all_teams.items():
            if team_info[CONSTANTS.DATA_JSON_TEAM_NAME_KEY] == team_name:
                return team_info, data, team_num

        return None, None, None

    @staticmethod
    def get_team_players(team_name: str) -> list:
        team_info, data, team_num = Service.get_team_info(team_name)

        if team_info is None:
            raise RuntimeError("DIDN'T FIND TEAM")

        team_players = team_info[CONSTANTS.DATA_JSON_TEAM_PLAYERS_KEY]
        all_players = data[CONSTANTS.DATA_JSON_PLAYER_KEY]
        team_player_names = []
        for player in all_players:
            if player in team_players:
                team_player_names.append(all_players[player])

        return team_player_names

    @staticmethod
    def get_player_to_team_photo(player_names: list):
        data = {}
        player_to_photo_dict = Utility.load_json(CONSTANTS.PERSON_TO_PHOTO_JSON_FILE)
        for player_name in player_names:
            if player_name in player_to_photo_dict:
                image_name = "images/" + player_to_photo_dict[player_name]
            else:
                image_name = CONSTANTS.DEFAULT_IMAGE

            data[player_name] = image_name

        return data

    @staticmethod
    def update_game(team_name: str, player_name: str, round_num: int, game_num: int, action: str):
        team_info, data, team_num = Service.get_team_info(team_name)
        game_file_path = Utility.create_game_file_path(game_num)
        game_data = Utility.load_json(game_file_path)

        if CONSTANTS.ROUND_KEY + str(round_num) not in game_data:
            game_data[CONSTANTS.ROUND_KEY + str(round_num)] = {game_data[CONSTANTS.GAME_JSON_TEAM1]: {},
                                                               game_data[CONSTANTS.GAME_JSON_TEAM2]: {}}

        #get player name to player key mapping
        player_key = None
        for key, name in data[CONSTANTS.DATA_JSON_PLAYER_KEY].items():
            if name == player_name:
                player_key = key
                break

        if player_key is None:
            raise RuntimeError("DIDN'T FIND PLAYER")

        cur_round = game_data[CONSTANTS.ROUND_KEY + str(round_num)]

        if player_key not in cur_round[team_num]:
            cur_round[team_num][player_key] = []

        player_actions = cur_round[team_num][player_key]
        player_actions.append(action)

        game_data[CONSTANTS.ROUND_KEY + str(round_num)] = cur_round

        Utility.write_json_data(game_file_path, game_data)

    @staticmethod
    def update_game1(cur_round_moves, round_counter, cur_team_sides, game_num, player_name, team_name, action):
        team_info, data, team_num = Service.get_team_info(team_name)

        game_file_path = Utility.create_game_file_path(game_num)
        game_data = Utility.load_json(game_file_path)
        game_team_num = Utility.create_array_of_playerX({CONSTANTS.GAME_JSON_TEAM1: game_data[CONSTANTS.GAME_JSON_TEAM1],
                                                         CONSTANTS.GAME_JSON_TEAM2: game_data[CONSTANTS.GAME_JSON_TEAM2]},
                                                        team_num)[0]  # from game data get team's team num

        cur_team_side = cur_team_sides[game_team_num]  # Attack or Defence
        try:
            player_key = Utility.create_array_of_playerX(data[CONSTANTS.DATA_JSON_PLAYER_KEY], player_name)[0]
        except Exception as e:
            print("Error with updating the game. Player not found")
            return

        # figure out which round it is
        round_num, new_round_moves, new_cur_team_side = Service.get_cur_game_round_num(
            cur_round_moves, round_counter, cur_team_side, player_key, action)

        cur_round_str = CONSTANTS.ROUND_KEY + str(round_num)
        if cur_round_str not in game_data:
           cur_round = {CONSTANTS.GAME_JSON_TEAM1: {}, CONSTANTS.GAME_JSON_TEAM2: {}}
        else:
            cur_round = game_data[cur_round_str]

        if player_key not in cur_round[game_team_num]:
            cur_round[game_team_num][player_key] = []
        

        print("ROUND NUM: ", round_num)
        player_actions = cur_round[game_team_num][player_key]
        player_actions.append(action)

        game_data[cur_round_str] = cur_round

        Utility.write_json_data(game_file_path, game_data)

        return round_num, new_round_moves, new_cur_team_side, game_team_num

    @staticmethod
    def get_cur_game_round_num(cur_round_moves: dict, round_counter: int, cur_team_side: str, player_key: str,
                               action: str):
        if cur_round_moves is None or cur_round_moves == {}:
            cur_round_moves[player_key] = action
            return 1, cur_round_moves, cur_team_side  # game just started
        # the game already started

        # the player didn't do any actions, so same round
        if player_key not in cur_round_moves:
            # same round
            if action == CONSTANTS.HIT and cur_team_side == CONSTANTS.ATTACK:
                pass
            elif action == CONSTANTS.SAVE and cur_team_side == CONSTANTS.DEFENCE:
                pass
            # new round
            elif action == CONSTANTS.HIT and cur_team_side == CONSTANTS.DEFENCE:
                return round_counter + 1, {player_key: action}, Utility.check_if_need_to_flip_team_side(cur_team_side, action)

            elif action == CONSTANTS.SAVE and cur_team_side == CONSTANTS.DEFENCE:
                return round_counter + 1, {player_key: action}, Utility.check_if_need_to_flip_team_side(cur_team_side, action)

            cur_round_moves[player_key] = action
            return round_counter, cur_round_moves, cur_team_side

        # the player is in the cur_round_moves

        # same round because player did 2 saves in a row
        if action == CONSTANTS.SAVE and cur_round_moves[player_key] == CONSTANTS.SAVE:
            return round_counter, cur_round_moves, cur_team_side

        # new round, and flip sides | never going to happen
        if action == CONSTANTS.SAVE and cur_round_moves[player_key] == CONSTANTS.HIT:  # last action was attack one
            return round_counter + 1, {player_key: action}, Utility.check_if_need_to_flip_team_side(cur_team_side, action)

        # new round, and flip sides | balls back
        if action == CONSTANTS.HIT and cur_round_moves[player_key] == CONSTANTS.HIT:
            return round_counter + 1, {player_key: action}, Utility.check_if_need_to_flip_team_side(cur_team_side, action)

        # new round, and flip sides
        if action == CONSTANTS.HIT and cur_round_moves[player_key] == CONSTANTS.SAVE:  # last action was defence one
            return round_counter + 1, {player_key: action}, Utility.check_if_need_to_flip_team_side(cur_team_side, action)

    @staticmethod
    def player_is_done(player_name: str, game_num: int, round_num: int):
        data = Utility.load_json(CONSTANTS.DATA_JSON_FILE)

        player_key = None
        for key, name in data[CONSTANTS.DATA_JSON_PLAYER_KEY].items():
            if name == player_name:
                player_key = key
                break

        if player_key is None:
            raise RuntimeError("DIDN'T FIND PLAYER")

        game_file_path = Utility.create_game_file_path(game_num)
        game_data = Utility.load_json(game_file_path)
        cur_round = game_data[CONSTANTS.ROUND_KEY + str(round_num)]
        if CONSTANTS.GAME_JSON_PLAYER_DONE not in cur_round:
            cur_round[CONSTANTS.GAME_JSON_PLAYER_DONE] = []

        players_done = cur_round[CONSTANTS.GAME_JSON_PLAYER_DONE]

        players_done.append(player_key)

        game_data[CONSTANTS.ROUND_KEY + str(round_num)] = cur_round

        Utility.write_json_data(game_file_path, game_data)
        
    @staticmethod
    def skip_round(game_num: int, round_num: int):
        game_file_path = Utility.create_game_file_path(game_num)
        game_data = Utility.load_json(game_file_path)

        round_num = int(round_num) + 1
        game_data[CONSTANTS.ROUND_KEY + str(round_num)] = {CONSTANTS.GAME_JSON_TEAM1: {}, CONSTANTS.GAME_JSON_TEAM2: {}}


        Utility.write_json_data(game_file_path, game_data)
