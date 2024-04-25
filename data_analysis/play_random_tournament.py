import numpy as np
from scipy.stats import truncnorm

class Player:
    def __init__(self, num):
        self.num = num
        self.hit_pr = truncnorm.rvs(0.02,1)
        self.save_pr = truncnorm.rvs(0,1)
        self.ml_t = 355*self.hit_pr/truncnorm.rvs(1,10) #take around 5 hits to drink one can
    def __str__(self):
        return f"{self.num}: Hit_pr[{self.hit_pr}], Save_pr[{self.save_pr}], Ml_p_t[{self.ml_t}]"
    
class Game:
    def __init__(self, players1, players2):
        self.home = players1
        self.away = players2
        
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