"""
A simple Markov model of the game:
Objective of the game is 
to make a hit n times
Where n will be sampled
from a normal distribution.
The P(Hit) comes from a 
Markov chain, which 
will be assigned to each 
player.
After a hit, the opposing
teams players will 
use a Markov chain 
to see if they decide
to save or not. If two
players decide to save
then they sample 
a normal distriution.
The one with the highest
score ends up saving. 
First team to get out
wins!
"""

import numpy as np
import random
from MarkovChain import MarkovChain
from DB_player import DB_player

def random_transition(k):
    result = np.array([[random.uniform(0, 0.1 / k) for i in range(k)] for j in range(k)])
    for j, r in enumerate(result):
        r[j] += 1 - sum(r)
    return result

amt_players_per_team = 3
#default 2 teams
amt_teams = 2

hit_states = ['hit', 'miss']
save_states = [True, False]

k = 2
loc = 5 #mean for htw
scale = 0.9 #std for htw
init_hit_p_list = [random_transition(k) for i in range(amt_players_per_team)]
init_save_p_list = [random_transition(k) for i in range(amt_players_per_team)]
init_htw_list = [np.random.normal(loc, scale) for i in range(amt_players_per_team)]

players = [DB_player(i, hit_states, init_hit_p_list[i], save_states, init_save_p_list[i], init_htw_list[i]) for i in range(amt_players_per_team)]

isGameDone = False

amt_of_stat = 3
amt_of_rounds = 60

X_game = np.zeros((amt_players_per_team*amt_teams, amt_of_stat, amt_of_rounds))
cur_turn = 0
while not isGameDone:
    
    #Check if the game is done
    if all(X_game[i,2, cur_turn] == 1 for i in range(amt_players_per_team*amt_teams)):
        isGameDone = True

"""
TODO:
implement the actual game logic
"""
