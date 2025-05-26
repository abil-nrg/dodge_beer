//-----------------------------------------------------------------------------//
// AddPlayerToTeamCardButton Component
// A styled button that opens the "Add Player" modal inside a team card
//-----------------------------------------------------------------------------//

// styles
import styles from "./AddPlayerToTeamCardButton.module.css";

//-----------------------------------------------------------------------------//
// Props Interface
//-----------------------------------------------------------------------------//

/**
 * @property {() => void} onOpenModal - Callback to open the player modal
 */
interface Props {
  onOpenModal: () => void;
}

//-----------------------------------------------------------------------------//
// Component Definition
//-----------------------------------------------------------------------------//

/**
 * A button used within a team card to trigger the "Add New Player" modal.
 *
 * @param {Props} props - Contains the callback to open the modal.
 * @returns {JSX.Element} A button component styled for team cards.
 */
export default function AddPlayerToTeamCardButton({ onOpenModal }: Props) {
  return (
    <button
      className={styles.newPlayerButton}
      onClick={(e) => {
        // Prevents the parent card click event (if any) from triggering
        e.stopPropagation();

        // Opens the modal to add a new player
        onOpenModal();
      }}
    >
      Add New Player
    </button>
  );
}
