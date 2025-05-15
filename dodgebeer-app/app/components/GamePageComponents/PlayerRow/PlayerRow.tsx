import styles from "./PlayerRow.module.css";
import { PlayerObject } from "@/types/player";
import Button from "@/app/components/ui/DashboardButton/Button";
import { useState } from "react";

interface Props {
  player: PlayerObject;
  disabled?: boolean;
}
export default function PlayerRow({ player, disabled = false }: Props) {
  async function handleHitClick() {}

  async function handleSaveClick() {}

  return (
    <div className={styles.playerRow} key={player.player_id}>
      <img
        src={player.player_photo}
        alt={player.player_name}
        className={styles.playerImage}
      />
      <span className={styles.playerName}>{player.player_name}</span>
      <div className={styles["button-group"]}>
        <Button
          text={"HIT"}
          color={"green"}
          onClick={handleHitClick}
          size={"large"}
          transparent={true}
          disabled={disabled}
        />
        <Button
          text={"SAVE"}
          color={"red"}
          onClick={handleSaveClick}
          size={"large"}
          transparent={true}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
