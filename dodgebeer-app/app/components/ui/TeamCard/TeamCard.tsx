import styles from "./TeamCard.module.css";
import { useEffect, useState } from "react";
import { API_ROUTE } from "@/app/api/all-routes";
import { MainDataConfig } from "@/types/main-data";

interface TeamProps {
  team_name: string;
  players: string[];
}

const DEFAULT_PHOTO = MainDataConfig.DEFAULT_PHOTO;

export default function TeamCard({ team_name, players }: TeamProps) {
  const [isError, setIsError] = useState(false);

  async function fetchPlayerPhoto(player_id: string) {
    const url = `${API_ROUTE.GET_PLAYER_BY_ID}?player_id=${encodeURIComponent(player_id)}`;
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();
    if (response.status !== 200) {
      setIsError(true);
      return;
    }

    console.log(data);
  }

  return (
    <div className={styles.teamCard}>
      <div className={styles.teamName}>{team_name}</div>
      <div className={styles.playersList}>
        {players.map((player_id, idx) => {
          fetchPlayerPhoto(player_id);
          return (
            <div className={styles.playerRow} key={idx}>
              {/*<img*/}
              {/*  src={player.photo || "/default-player.png"}*/}
              {/*  alt={player.name}*/}
              {/*  className={styles.playerImage}*/}
              {/*/>*/}
              <span className={styles.playerName}>{player_id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
