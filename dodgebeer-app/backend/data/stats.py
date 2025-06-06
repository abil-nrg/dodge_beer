import json
import sys
from collections import defaultdict
from tabulate import tabulate


def load_games_from_files(filenames):
    games = []
    for fname in filenames:
        with open(fname, 'r') as f:
            game_data = json.load(f)
            games.append(game_data)
    return games


def load_player_names(data_file):
    with open(data_file, 'r') as f:
        meta = json.load(f)
    return {pid: pinfo["name"] for pid, pinfo in meta["players"].items()}


def compute_global_stats(games):
    hit_attempts = defaultdict(int)
    successful_hits = defaultdict(int)
    save_counts = defaultdict(int)
    fastest_save = defaultdict(lambda: float('inf'))
    first_appearance = {}

    for game in games:
        players_done_so_far = set()

        for round_idx, round_data in enumerate(game['rounds']):
            for player in round_data.get('players_done', []):
                if player not in first_appearance:
                    first_appearance[player] = round_idx

            players_done_this_round = set(round_data.get('players_done', []))

            for team_key in ['team1_id', 'team2_id']:
                team = round_data[team_key]
                side = team['side']
                players = team.get('players', {})

                if side == 'ATTACK':
                    for player in players:
                        # was here before, need to REFACTOR
                        if player not in players_done_so_far:
                            hit_attempts[player] += 1
                    # +1 to those who hit, gj!
                    for player in players_done_this_round:
                        if player in players:
                            successful_hits[player] += 1

                elif side == 'DEFENCE':
                    for player, actions in players.items():
                        for action in actions:
                            if action['action'] == 'SAVE' and action['time'] >= 0:
                                save_counts[player] += 1
                                fastest_save[player] = min(fastest_save[player], action['time'])

            # Ukeep track of who is done
            players_done_so_far.update(players_done_this_round)

    # fix NaNs
    for player in fastest_save:
        if fastest_save[player] == float('inf'):
            fastest_save[player] = None

    return hit_attempts, successful_hits, save_counts, fastest_save, first_appearance



def build_player_stats_table(hit_attempts, successful_hits, save_counts, fastest_save, first_appearance, player_names):
    all_players = set(hit_attempts) | set(successful_hits) | set(save_counts) | set(fastest_save) | set(first_appearance)
    table = []

    # get the max turn 
    max_turn = max(first_appearance.values()) if first_appearance else 0

    for player_id in sorted(all_players):
        player_name = player_names.get(player_id, player_id)

        # replace hit attempts
        attempts = first_appearance.get(player_id, max_turn)
        successful = successful_hits.get(player_id, 0)
        
        #get the hit %
        hit_pct = (successful / attempts * 100) if attempts > 0 else None
        
        saves = save_counts.get(player_id, 0)
        fast_save = fastest_save.get(player_id)
        first_turn = first_appearance.get(player_id)

        table.append({
            'Player': player_name,
            'HIT Attempts (First Turn Done)': attempts,
            'Successful HITs': successful,
            'HIT %': round(hit_pct, 2) if hit_pct is not None else "N/A",
            'SAVE Count': saves,
            'Fastest SAVE (ms)': fast_save if fast_save is not None else "N/A",
            'First Turn Done': first_turn if first_turn is not None else "N/A"
        })

    return table


def sort_table(table, sort_key):
    if sort_key == 'hit':
        return sorted(table, key=lambda x: (x['HIT %'] != "N/A", x['HIT %']), reverse=True)
    elif sort_key == 'saves':
        return sorted(table, key=lambda x: x['SAVE Count'], reverse=True)
    elif sort_key == 'fastest_save':
        return sorted(table, key=lambda x: (x['Fastest SAVE (ms)'] != "N/A", x['Fastest SAVE (ms)']))
    elif sort_key == 'first_turn_done':
        return sorted(table, key=lambda x: (x['First Turn Done'] != "N/A", x['First Turn Done']))
    return table


def main(filenames, sort_key=None, data_file='data.json'):
    games = load_games_from_files(filenames)
    player_names = load_player_names(data_file)
    hit_attempts, successful_hits, save_counts, fastest_save, first_appearance = compute_global_stats(games)
    table = build_player_stats_table(hit_attempts, successful_hits, save_counts, fastest_save, first_appearance, player_names)
    table = sort_table(table, sort_key)
    print(tabulate(table, headers="keys", tablefmt="grid"))


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args:
        print("Usage: python stats.py game1.json game2.json ... [--sort hit|saves|fastest_save|first_turn_done] [--data data.json]")
        sys.exit(1)

    sort_key = None
    data_file = 'data.json'
    filenames = []

    i = 0
    while i < len(args):
        if args[i] == '--sort':
            i += 1
            sort_key = args[i] if i < len(args) else None
        elif args[i] == '--data':
            i += 1
            data_file = args[i] if i < len(args) else 'data.json'
        else:
            filenames.append(args[i])
        i += 1

    main(filenames, sort_key, data_file)
