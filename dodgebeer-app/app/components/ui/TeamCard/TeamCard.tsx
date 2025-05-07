import styles from "./TeamCard.module.css";
import { useEffect, useState } from "react";
import { ApiClient } from "@/app/api/all-routes";
import { MainDataConfig } from "@/types/main-data";
import { Player } from "@/types/player";
import { IoIosRemoveCircleOutline } from "react-icons/io";

interface TeamProps {
  team_id: string;
  team_name: string;
  playerIds: string[];
}

const DEFAULT_PHOTO = MainDataConfig.DEFAULT_PHOTO;

async function removePlayerFromTeam(playerId: string, teamId: string) {
  ApiClient.removePlayerFromTeam(playerId, teamId);
}

export default function TeamCard({ team_id, team_name, playerIds }: TeamProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchPlayerData() {
      const newPlayers: Record<string, Player> = {};

      await Promise.all(
        playerIds.map(async (player_id) => {
          try {
            const response = await ApiClient.GetPLayerById(player_id);

            if (!response.ok) throw new Error("Bad response");

            newPlayers[player_id] = (await response.json()) as Player;
          } catch (err) {
            setIsError(true);
            newPlayers[player_id] = {
              name: player_id,
              photo: DEFAULT_PHOTO,
            };
          }
        }),
      );

      setPlayers(newPlayers);
    }

    fetchPlayerData();
  }, [playerIds]);

  return (
    <div
      className={`${styles.teamCard} ${isSelected ? styles.activeCard : ""}`}
      onClick={() => {
        setIsSelected((prev) => !prev);
      }}
    >
      <div className={styles.teamName}>{team_name}</div>
      <div className={styles.playersList}>
        {playerIds.map((player_id) => {
          const player = players[player_id];
          return (
            <div className={styles.playerRow} key={player_id}>
              <img
                src={player?.photo || DEFAULT_PHOTO}
                alt={player?.name || player_id}
                className={styles.playerImage}
              />
              <span className={styles.playerName}>
                {player?.name || player_id}
              </span>
              <button
                className={styles.playerActionInTeam}
                onClick={(event) => {
                  event.stopPropagation();
                  removePlayerFromTeam(player_id, team_id);
                }}
              >
                <IoIosRemoveCircleOutline />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
