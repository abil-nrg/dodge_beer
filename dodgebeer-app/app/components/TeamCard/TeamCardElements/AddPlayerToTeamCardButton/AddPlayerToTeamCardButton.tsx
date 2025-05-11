// styles
import styles from "./AddPlayerToTeamCardButton.module.css";

interface Props {
  onOpenModal: () => void;
}

export default function AddPlayerToTeamCardButton({ onOpenModal }: Props) {
  return (
    <button
      className={styles.newPlayerButton}
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal();
      }}
    >
      Add New Player
    </button>
  );
}
