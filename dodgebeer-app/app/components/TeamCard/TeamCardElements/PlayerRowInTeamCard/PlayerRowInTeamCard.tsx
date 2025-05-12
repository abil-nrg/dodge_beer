// app/components/ui/TeamCard/PlayerRowInTeamCard.tsx

// types
import { Player } from "@/types/main-data";
// styles & icons
import styles from "@/app/components/TeamCard/TeamCard.module.css";
import { IoIosRemoveCircleOutline } from "react-icons/io";

/**
 * Props for PlayerRowInTeamCard component
 */
interface PlayerRowInTeamCardProps {
  /** Player data, can be partial if fetch fails */
  player: Player;
  /** Unique ID of the player (used as fallback and React key) */
  playerId: string;
  /** Callback to trigger when the delete button is clicked */
  onPlayerDelete: () => void;
  /** Default fallback values for name and photo if player data is missing */
  defaultOptions: {
    name: string;
    photo: string;
  };
}

/**
 * Displays a single player's name, photo, and delete button inside a team card.
 *
 * Used in TeamCard to render a list of players belonging to a specific team.
 */
export default function PlayerRowInTeamCard({
  player,
  playerId,
  onPlayerDelete,
  defaultOptions,
}: PlayerRowInTeamCardProps) {
  return (
    <div className={styles.playerRow} key={playerId}>
      <img
        src={player?.photo || defaultOptions.photo}
        alt={player?.name || defaultOptions.name}
        className={styles.playerImage}
      />
      <span className={styles.playerName}>
        {player?.name || defaultOptions.name}
      </span>
      <button
        className={styles.playerActionInTeam}
        onClick={(event) => {
          event.stopPropagation();
          onPlayerDelete();
        }}
      >
        <IoIosRemoveCircleOutline />
      </button>
    </div>
  );
}
