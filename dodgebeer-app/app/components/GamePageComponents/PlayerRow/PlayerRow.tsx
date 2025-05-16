import styles from "./PlayerRow.module.css";
import { PlayerObject } from "@/types/player";
import Button from "@/app/components/ui/DashboardButton/Button";
import { useState } from "react";
import { IoIosRemoveCircleOutline } from "react-icons/io";

interface Props {
  player: PlayerObject;
  disabled?: boolean;
  isDisableSave?: boolean;
  onHitClick: (player_id: string, time?: number) => void;
  onSaveClick: (player_id: string, time?: number) => void;
}
export default function PlayerRow({
  player,
  onHitClick,
  onSaveClick,
  isDisableSave = false,
}: Props) {
  const [disabled, setDisabled] = useState<boolean>(false);
  async function handleHitClick() {
    const time = undefined; // TODO:
    onHitClick(player.player_id, time);
  }

  async function handleSaveClick() {
    const time = undefined; // TODO:
    onSaveClick(player.player_id, time);
  }

  return (
    <div className={styles.playerRow} key={player.player_id}>
      <img
        src={player.player_photo}
        alt={player.player_name}
        className={styles.playerImage}
      />
      <span className={styles.playerName}>{player.player_name}</span>
      <button
        className={styles.playerIsDoneBtn}
        onClick={() => {
          setDisabled(true);
        }}
      >
        <IoIosRemoveCircleOutline />
      </button>
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
