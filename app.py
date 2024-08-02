from flask import Flask, render_template, request
from web.logic.service import Service
app = Flask(__name__)

# RENDER HTML

@app.route('/')
def home():  # put application's code here
    return render_template("index.html")


@app.route('/createPlayer')
def create_player():
    return render_template("create_player.html")


@app.route('/createTeam')
def create_team():
    return render_template("create_team.html")


@app.route('/play')
def play():
    return render_template("play.html")


@app.route('/newGame')
def new_game():
    return render_template("new_game.html")


# REST API

@app.route('/api/createPlayer')
def create_player_api():
    name: str = request.args['player_name']
    Service.create_player(name)


@app.route('/api/createTeam')
def create_team_api():
    team_name: str = request.args['team_name']
    player1_name: str = request.args['player1_name']
    player2_name: str = request.args['player2_name']
    player3_name: str = request.args['player3_name']
    Service.create_team(team_name, player1_name, player2_name, player3_name)


@app.route('/api/createGame')
def create_game_api():
    team1_name: str = request.args['team1_name']
    team2_name: str = request.args['team2_name']
    Service.create_game(team1_name, team2_name)


if __name__ == '__main__':
    app.run(debug=True, port=8080)
