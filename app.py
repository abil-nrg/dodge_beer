import os

from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

from web.logic.service import Service
from web.util.constants import CONSTANTS
from web.util.utility import Utility

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = CONSTANTS.UPLOAD_FOLDER


# RENDER HTML

@app.route('/')
def home():  # put application's code here
    return render_template("index.html")


@app.route('/createPlayer')
def create_player():
    return render_template("create_player.html")


@app.route('/createTeam')
def create_team():
    available_players = Service.get_players_available()
    return render_template("create_team.html", players=available_players)


@app.route('/newGame')
def new_game():
    all_teams = Service.get_all_teams()
    return render_template("new_game.html", teams=all_teams)


# REST API

@app.route('/api/createPlayer', methods=['GET', 'POST'])
def create_player_api():
    if request.method == 'GET':
        return render_template("create_player.html")

    name = request.form.get('player_name')
    photo = request.files.get('photo')

    if photo and Utility.allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        photo.save(photo_path)

    Service.create_player(name)
    return render_template("create_player.html", success=True)


@app.route('/api/createTeam')
def create_team_api():
    team_name: str = request.args['team_name']
    player1_name: str = request.args['player1']
    player2_name: str = request.args['player2']
    player3_name: str = request.args['player3']
    Service.create_team(team_name, player1_name, player2_name, player3_name)

    return render_template("create_team.html", success=True)


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

    return render_template("play.html",
                           game_num=game_num, game_file=game_file,
                           team1_name=team1_name, team2_name=team2_name,
                           team1=team1_players_to_photos, team2=team2_players_to_photos
                           )


@app.route('/updateGame', methods=['GET', 'POST'])
def update_game():
    if request.method == 'GET':
        return jsonify(), 200

    data = request.get_json()

    team_name = data.get("team_name")
    player_name = data.get("player_name")
    round_num = data.get("round_num")
    game_num = data.get("game_num")
    action = data.get("action")
    Service.update_game(team_name, player_name, round_num, game_num, action.upper())
    return jsonify(), 200

@app.route('/playerIsDone', methods=['GET', 'POST'])
def player_is_done():
    if request.method == 'GET':
        return jsonify(), 200
    data = request.get_json()

    player_name = data.get("player_name")
    round_num = data.get("round_num")
    game_num = data.get("game_num")

    Service.player_is_done(player_name, game_num, round_num)
    return jsonify(), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)
