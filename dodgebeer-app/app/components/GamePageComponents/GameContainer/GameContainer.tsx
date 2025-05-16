import styles from "./GameContainer.module.css";
import TeamCardInGame from "@/app/components/GamePageComponents/TeamCardInGame/TeamCardInGame";
import { FullTeamObject } from "@/types/team";
import { ApiClient } from "@/app/api/all-routes";
import { ApiResponse } from "@/types/api";
import { PlayerStatsWithInfo, UpdateGameResponse } from "@/types/game-api";
import { useEffect, useState } from "react";
import { GameStatus } from "@/types/game-data";
import { toast, ToastContainerCustom } from "@/app/util/toast-alert-config";
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
  const [gameStatus, setGameStatus] = useState<GameStatus>("IN_PROGRESS");
  const [playersStats, setPlayersStats] = useState<PlayerStatsWithInfo[]>([]);
  // disabling buttons
  const [team1DisableSave, setTeam1DisableSave] = useState(true);
  const [team2DisableSave, setTeam2DisableSave] = useState(true);

  useEffect(() => {
    updateGameState(); // doesn't need to be async
  }, []);

  useEffect(() => {
    if (gameStatus === "DONE") {
      getPlayerStats();
      toast.info("GAME IS DONE. PLEASE STOP PLAYING");
    }
  }, [gameStatus]);

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
    setGameStatus(data.status);
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

  async function getPlayerStats() {
    const resp = await ApiClient.getPlayerStatsRoute(gameId);
    const result = (await resp.json()) as ApiResponse<{
      players: PlayerStatsWithInfo[];
    }>;
    setPlayersStats(result.data.players);
  }

  async function handlePlayerDone(player_id: string) {
    await ApiClient.addPlayerIsDoneRoute(gameId, player_id);
    await updateGameState();

    setLastActionText("Someone finished their drink! Are you sure?!");
  }
  if (gameStatus === "DONE") {
    return (
      <>
        <h1>GAME IS DONE!</h1>
        <h3>STATS:</h3>

        <div
          style={{
            maxHeight: "90vh", // Limit height so overflow can happen
            overflowY: "auto", // Enable vertical scrolling
            paddingRight: "1rem", // Padding so scrollbar doesn't overlap content
          }}
        >
          {playersStats.map((p) => (
            <div
              key={p.player_id}
              style={{
                border: "1px solid #ccc",
                margin: "1rem 0",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h4>
                {p.player_name} of {p.team_name}
              </h4>
              <p>
                ✅ HITS: {p.hits} out of {p.attack_rounds} ATTACK rounds
              </p>
              <p>
                ❌ MISSES: {p.misses} out of {p.attack_rounds} ATTACK rounds
              </p>
              <p>
                🛡️ SAVES: {p.saves} out of {p.defence_rounds} DEFENCE rounds
              </p>
              <p>🏁 DONE IN ROUND: {p.player_done_round ?? "N/A"}</p>
            </div>
          ))}
        </div>

        <ToastContainerCustom />
      </>
    );
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
              onPlayerDone={handlePlayerDone}
            />
          </div>
          <div className={styles["team-section"]}>
            <div className={styles["team-side-label"]}>{team2Side}</div>
            <TeamCardInGame
              team={team2}
              onPlayerHit={handlePlayerHit}
              onPlayerSave={handlePlayerSave}
              onPlayerDone={handlePlayerDone}
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
