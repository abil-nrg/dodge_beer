import os


class CONSTANTS:
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    DATA_FOLDER_PATH = os.path.join(root_dir, 'data')

    DATA_JSON_FILE = os.path.join(DATA_FOLDER_PATH, "data.json")
    DATA_JSON_PLAYER_SEQ = "player_count"
    DATA_JSON_TEAM_SEQ = "team_count"
    DATA_JSON_GAME_SEQ = "game_count"

    DATA_JSON_PLAYER_KEY = "players"
    DATA_JSON_TEAM_KEY = "teams"
    DATA_JSON_TEAM_NAME_KEY = "team_name"
    DATA_JSON_TEAM_PLAYERS_KEY = "team_players"

    BASE_GAME_FILE_PATH = os.path.join(DATA_FOLDER_PATH, "game")

    GAME_JSON_TEAM1 = "team1"
    GAME_JSON_TEAM2 = "team2"
    GAME_JSON_ROUND_COUNT = "round_count"
    GAME_JSON_PLAYER_DONE = "players_done"

    PLAYER_KEY = "player"
    TEAM_KEY = "team"
    GAME_KEY = "game"
    ROUND_KEY = "round"

    HIT = "HIT"
    MISS = "MISS"
    SAVE = "SAVE"
    NO_SAVE = "NO_SAVE"
    NONE = "NONE"
    ATTACK = "ATTACK"
    DEFENCE = "DEFENCE"

    ALLOWED_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png']
    UPLOAD_FOLDER = os.path.join(root_dir, "static", "images")

    IMAGE_EXTENSION = ".png"
    DEFAULT_IMAGE = "images/drunk.jpg"

    PERSON_TO_PHOTO_JSON_FILE = os.path.join(DATA_FOLDER_PATH, "person_to_photo_relation.json")
