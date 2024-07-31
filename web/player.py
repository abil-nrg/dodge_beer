from enum import Enum


class Player:
    def __init__(self, name):
        self.name = name


class Team:
    def __init__(self, team_name, team_number):
        self.team_name: str = team_name
        self.team_number: int = team_number
        self.team_members: list[Player] = []
        self.games: list[Game] = []

    def add_member(self, member):
        self.team_members.append(member)


class Game:
    def __init__(self, team1: Team, team2: Team):
        self.team1 = team1
        self.team2 = team2
        self.rounds: list[Turn] = []

    def add_round(self, round):
        self.rounds.append(round)


class Action(Enum):
    NO_SAVE = "NO SAVE"
    MISS = "MISS"
    SAVE = "SAVE"
    HIT = "HIT"


class Turn:
    def __init__(self, turn_num):
        self.turn_num: int = turn_num
        self.actions: list[tuple[Player, Action]] = []

    def add_event(self, player: Player, action: Action):
        self.actions.append((player, action))
