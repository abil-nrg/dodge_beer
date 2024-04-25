import numpy as np
from scipy.stats import truncnorm
from random import choice

class Player:
    def __init__(self, num):
        self.num = num
        self.hit_pr = truncnorm.rvs(0.02,1)
        self.save_pr = truncnorm.rvs(0,1)
        self.ml_t = 355*self.hit_pr/truncnorm.rvs(1,10) #take around 5 hits to drink one can
        self.doc = choice([0.0, 2.5, 4.0, 5.0, 5.5, 7.0])
    def __str__(self):
        return f"{self.num}: Hit_pr[{self.hit_pr}], Save_pr[{self.save_pr}], Ml_p_t[{self.ml_t}]"
    
class Poule_Game:
    def __init__(self, player1, player2):
        self.home = player1
        self.away = player2
    def generate():
        """
        Generates the hits made, saves made, cans drunk, and turns to win
        for both players
        """
        
        pass

class Tournament_Game:
    def __init__(self, team1, team2):
        self.team1 = team1
        self.team2 = team2

def generate_players(n):
    """
    N amount of players are generated, each has a mean 
    hit%, save%, and ml/turn, with an assumed
    Normal distribution
    """
    players = []
    for num in range(0, n):
        players.append(Player(num))
    return players

def main(amt_players):
    players = generate_players(amt_players)
    for player in players:
        print(player)
    return 1


main(5)