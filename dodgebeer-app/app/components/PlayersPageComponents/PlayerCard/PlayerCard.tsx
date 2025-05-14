import styles from "./PlayerCard.module.css";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

interface Props {
  id: string;
  name: string;
  photo: string;
  onPlayerDelete: () => void;
}

/**
 * Displays a player's image and name in a styled card.
 */
export default function PlayerCard({ id, name, photo, onPlayerDelete }: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  //-----------------------------------------------------------------------------//
  /** Toggles selection (highlight) state of this card */
  //-----------------------------------------------------------------------------//
  function toggleCardSelection() {
    setIsSelected((prev) => !prev);
  }

  function deletePlayer(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onPlayerDelete();
  }

  const selectedCardClassName = isSelected ? styles.activeCard : "";
  return (
    <div
      className={`${styles.playerCard} ${selectedCardClassName}`}
      onClick={toggleCardSelection}
    >
      <button className={styles.deletePlayerCard} onClick={deletePlayer}>
        <MdDelete />
      </button>
      <Image src={`${photo}`} alt={name} width={200} height={200} priority />
      <h2>{name}</h2>
    </div>
  );
}
