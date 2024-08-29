import json
import sys
import numpy as np

tourn_file = open('../data/sample-data.json')

tourn_data = json.load(tourn_file)

player_cnt = tourn_data['player_count']
team_cnt = tourn_data['team_count']
game_count = tourn_data['game_count']

players = tourn_data['players']

teams = tourn_data['teams']

print(f"Usage : {sys.argv[0]} game_file")
game_file = open(str(sys.argv[1]))
game_data = json.load(game_file)

amt_of_players = 6
amt_of_stat = 3
amt_of_rounds = 0

for round in game_data:
    amt_of_rounds += 1

amt_of_rounds = amt_of_rounds - 3

X_game = np.zeros((amt_of_players, amt_of_stat, amt_of_rounds))
team1 = game_data['team1']
team2 = game_data['team2']

player_list = teams[team1]['team_players'] + teams[team2]['team_players'] #list of players

player_enum = enumerate(player_list) #matrix place to player number
print(list(player_enum))

m_to_p = dict((i,j) for i,j in player_enum)
player_enum = enumerate(player_list) 
p_to_m = dict((j,i) for (i,j) in player_enum)

print(m_to_p)
print(p_to_m)

loop_ctr = 0

for round in game_data:
    if loop_ctr >= 3:
        #the rounds
        for te in game_data[round]:
            if te == 'players_done':
                #players which are done
                for pl in game_data[round][te]:
                    pl_index = p_to_m[pl]
                    X_game[pl_index, 2, loop_ctr - 3] = 1
            else:
                for pl in game_data[round][te]:
                    pl_index = p_to_m[pl]
                    if  'HIT' in game_data[round][te][pl]:
                        X_game[pl_index, 0, loop_ctr - 3] = 1
                    elif 'SAVE' in game_data[round][te][pl]:
                        X_game[pl_index, 1, loop_ctr - 3] = 1 + X_game[pl_index, 1, loop_ctr - 3]

            print(X_game[:,:,loop_ctr  -3 ])
    loop_ctr += 1


file_name = 'game_matrix' + str(sys.argv[1][-4]) + '.npy'
np.save(file_name, X_game)

dict_file_name = 'game_dict'+ str(sys.argv[1][-4]) + '.json'
json_obj = json.dumps(m_to_p)
print("---")
print(np.sum(X_game, axis=2))
    


