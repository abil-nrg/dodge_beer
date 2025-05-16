import styles from "./GameContainer.module.css";
import TeamCardInGame from "@/app/components/GamePageComponents/TeamCardInGame/TeamCardInGame";
import { FullTeamObject } from "@/types/team";
import { ApiClient } from "@/app/api/all-routes";
import { ApiResponse } from "@/types/api";
import { UpdateGameResponse } from "@/types/game-api";
import { useState } from "react";
interface Props {
  gameId: string;
  team1: FullTeamObject;
  team2: FullTeamObject;
}
export default function GameContainer({ gameId, team1, team2 }: Props) {
  // round counter
  const [roundCounter, setRoundCounter] = useState(0);
  // team sides
  const [team1Side, setTeam1Side] = useState("ATTACK");
  const [team2Side, setTeam2Side] = useState("DEFENCE");
  // last action text
  const [lastActionText, setLastActionText] = useState(
    "PLEASE START THE GAME NOW!",
  );
  // disabling buttons
  const [team1DisableSave, setTeam1DisableSave] = useState(true);
  const [team2DisableSave, setTeam2DisableSave] = useState(true);

  function findTeamNameAndPlayer(team_id: string, player_id: string) {
    const info = {
      team_name: "",
      player_name: "",
    };
    if (team1.team.team_id === team_id) {
      team1.players.map((pl) => {
        if (pl.player_id === player_id) {
          info.team_name = team1.team.team_name;
          info.player_name = pl.player_name;
        }
      });
    }
    if (team2.team.team_id === team_id) {
      team2.players.map((pl) => {
        if (pl.player_id === player_id) {
          info.team_name = team2.team.team_name;
          info.player_name = pl.player_name;
        }
      });
    }
    return info;
  }

  async function updateGameState() {
    const resp = await ApiClient.getGameStatusRoute(gameId);
    const result = (await resp.json()) as ApiResponse<UpdateGameResponse>;
    const data = result.data;

    if (!data) {
      console.error("Error received on game update");
      return;
    }
    setRoundCounter(data.round_counter);
    setTeam1Side(data.team1_side);
    setTeam2Side(data.team2_side);
  }

  async function handlePlayerHit(
    team_id: string,
    player_id: string,
    time?: number,
  ) {
    await ApiClient.playerHitInGameRoute(gameId, team_id, player_id, time);
    await updateGameState();

    const info = findTeamNameAndPlayer(team_id, player_id);
    const text = `${info.player_name} from ${info.team_name} made a HIT!`;
    setLastActionText(text);
  }

  async function handlePlayerSave(
    team_id: string,
    player_id: string,
    time?: number,
  ) {
    await ApiClient.playerSaveInGameRoute(gameId, team_id, player_id, time);
    await updateGameState();

    const info = findTeamNameAndPlayer(team_id, player_id);
    const text = `${info.player_name} from ${info.team_name} made a SAVE!`;
    setLastActionText(text);
  }
  return (
    <>
      <h1 className={styles["round-text"]}>Round {roundCounter}</h1>
      <div className={styles["game-container"]}>
        <div className={styles["team-card-container"]}>
          <div className={styles["team-section"]}>
            <div className={styles["team-side-label"]}>{team1Side}</div>
            <TeamCardInGame
              team={team1}
              onPlayerHit={handlePlayerHit}
              onPlayerSave={handlePlayerSave}
            />
          </div>
          <div className={styles["team-section"]}>
            <div className={styles["team-side-label"]}>{team2Side}</div>
            <TeamCardInGame
              team={team2}
              onPlayerHit={handlePlayerHit}
              onPlayerSave={handlePlayerSave}
            />
          </div>
        </div>
      </div>
      {/* Last Action Text */}
      <div className={styles["last-action-container"]}>
        <p className={styles["last-action-text"]}>{lastActionText}</p>
      </div>
    </>
  );
}
