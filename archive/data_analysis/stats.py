import json
import numpy as np

data = json.load(open('../data/data.json'))

n = data['game_count'] #amt of games played

player_hits = {}
player_saves = {}

for p in data['players']:
    player_hits[data['players'][p]] = np.zeros((n, 2))
    player_saves[data['players'][p]] = np.zeros((n, 2))

print(player_hits)
for i in range(1, n + 1): #go thru each game
    gameid = 'game' + str(i) + ".json"
    print(f"-_-_-_-GAME NUMBER {i}")

    game = json.load(open('../data/' + gameid))

    t1p = data['teams'][game['team1']]['team_players']
    t2p = data['teams'][game['team2']]['team_players']

    ps = t1p + t2p
    d1 = {k:ctr for ctr, k in enumerate(ps)}


    temp_p = np.zeros((6,3,len(game) - 3))

    for ctr, rnd in enumerate(game):
        if ctr >= 3:
            print(f'===Turn {ctr - 3}===')
            for t in ['team1', 'team2']:
                print(f"Team {t}")
                for p in game[rnd][t]:
                    print(f"{p}")
                    print(game[rnd][t][p])
                    if game[rnd][t][p][0] == 'HIT' :
                        temp_p[d1[p], 0, ctr - 3] += 1
                    elif game[rnd][t][p][0] == 'SAVE':
                        temp_p[d1[p], 1, ctr - 3] += len(game[rnd][t][p])

            if 'players_done' in game[rnd]:
                for p in game[rnd]['players_done']:
                    temp_p[d1[p], 2, ctr - 3] = 1
                    print(f"{p} OUT")
        
    
    cum = np.sum(temp_p, axis=2)

    for p in ps:
        if np.argmax(temp_p[d1[p],2, :]) == 0 :
            end_t = len(game) - 3
        else:
            end_t = np.argmax(temp_p[d1[p],2, :])
        print(f"Ended on {end_t}")
        print(f"Player {data['players'][p]} hs : {cum[d1[p], 0] / end_t}")
        print(f"Player {data['players'][p]} saves: {cum[d1[p], 1] / end_t}")
        player_hits[data['players'][p]][n - 1, 0] = cum[d1[p], 0]
        player_hits[data['players'][p]][n - 1, 1] = end_t

        player_saves[data['players'][p]][n - 1, 0] = cum[d1[p], 0]
        player_saves[data['players'][p]][n - 1, 1] = end_t


for p in player_hits:
    print(np.shape(player_hits[p]))
    total_hits, total_throws = np.sum(player_hits[p], axis = 0)

    print(total_throws)
    if total_throws == 0:
        player_hits[p] =  0
    else:
        player_hits[p] =  total_hits / total_throws

print(player_hits)

for p in player_saves:
    print(np.shape(player_saves[p]))
    total_saves, total_throws = np.sum(player_saves[p], axis = 0)

    print(total_throws)
    if total_throws == 0:
        player_saves[p] =  0
    else:
        player_saves[p] =  total_saves / total_throws

print(f"HIT % ****{sorted(player_hits.items(), key=lambda kv: (kv[1], kv[0]))}") 
print(f"SAVE % ****{sorted(player_saves.items(), key=lambda kv: (kv[1], kv[0]))}") 