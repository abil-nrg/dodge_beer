import os

from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

from web.logic.service import Service
from web.util.constants import CONSTANTS
from web.util.utility import Utility

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = CONSTANTS.UPLOAD_FOLDER

round_moves = {}
round_counter = 1
cur_team_sides = {
    "team1": CONSTANTS.ATTACK,
    "team2": CONSTANTS.DEFENCE
}

# RENDER HTML

@app.route('/')
def home():  # put application's code here
    return render_template("index.html")


@app.route('/createPlayer')
def create_player(success=False):
    print(success)
    return render_template("create_player.html", success=success)


@app.route('/createTeam')
def create_team(success=False):
    available_players = Service.get_players_available()
    return render_template("create_team.html", players=available_players, success=success)


@app.route('/newGame')
def new_game():
    all_teams = Service.get_all_teams()
    return render_template("new_game.html", teams=all_teams)


# REST API

@app.route('/api/createPlayer', methods=['GET', 'POST'])
def create_player_api():
    if request.method == 'GET':
        return create_player()

    name = request.form.get('player_name')
    photo = request.files.get('photo')
    filename = None
    
    if photo and Utility.allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        photo.save(photo_path)

    Service.create_player(name)

    if name is not None and filename is not None:
        Service.add_person_to_photo_file(name, filename)

    return create_player(success=True)


@app.route('/api/createTeam', methods=['GET', 'POST'])
def create_team_api():
    if request.method == 'GET':
        return render_template("create_team.html")

    team_name: str = request.form.get('team_name')
    player1_name: str = request.form.get('player1')
    player2_name: str = request.form.get('player2')
    player3_name: str = request.form.get('player3')
    Service.create_team(team_name, player1_name, player2_name, player3_name)

    return create_team(success=True)


@app.route('/api/createGame')
def create_game_api():
    team1_name: str = request.args['team1_name']
    team2_name: str = request.args['team2_name']
    game_num = Service.create_game(team1_name, team2_name)
    return redirect(url_for("play_game", team1_name=team1_name, team2_name=team2_name, game_num=game_num))


@app.route('/play')
def play_game():
    game_num: int = request.args.get('game_num')
    team1_name: str = request.args.get('team1_name')
    team2_name: str = request.args.get('team2_name')

    team1_players: list = Service.get_team_players(team1_name)
    team2_players: list = Service.get_team_players(team2_name)
    team1_players_to_photos = Service.get_player_to_team_photo(team1_players)
    team2_players_to_photos = Service.get_player_to_team_photo(team2_players)

    game_file: str = Utility.create_game_file_path(game_num)

    return render_template("play.html", round_num=round_counter,
                           game_num=game_num, game_file=game_file,
                           team1_name=team1_name, team2_name=team2_name,
                           team1=team1_players_to_photos, team2=team2_players_to_photos
                           )


@app.route('/api/getRoundNum')
def get_round_num():
    global round_counter
    return jsonify({'round_num': round_counter})

@app.route('/updateGame', methods=['GET', 'POST'])
def update_game():
    global round_moves
    global round_counter
    global cur_team_sides

    if request.method == 'GET':
        return jsonify(), 200

    data = request.get_json()

    team_name = data.get("team_name")
    player_name = data.get("player_name")
    game_num = data.get("game_num")
    action = data.get("action")
    new_round_num, new_round_moves, new_cur_team_side, game_team_num = (Service.update_game1
                                                                        (round_moves, round_counter, cur_team_sides,
                                                                         game_num,
                                                                         player_name, team_name, action.upper()))

    if cur_team_sides[game_team_num] != new_cur_team_side:
        new_team_sides = Utility.flip_both_team_sides(cur_team_sides)
        cur_team_sides = new_team_sides

    round_moves = new_round_moves
    round_counter = new_round_num
    return jsonify(), 200


@app.route('/playerIsDone', methods=['GET', 'POST'])
def player_is_done():
    global round_counter
    if request.method == 'GET':
        return jsonify(), 200
    data = request.get_json()

    player_name = data.get("player_name")
    game_num = data.get("game_num")

    Service.player_is_done(player_name, game_num, round_counter)
    return jsonify(), 200


if __name__ == '__main__':
    app.run(debug=True, port=8080)
