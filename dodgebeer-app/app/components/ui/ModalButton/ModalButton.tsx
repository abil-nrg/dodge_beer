import styles from "./ModalButton.module.css";

//-----------------------------------------------------------------------------//
/** Props for the ModalButton component */
//-----------------------------------------------------------------------------//
interface Props {
  /** Text to display inside the button */
  text: string;
  /** Color theme for the button, affects styling */
  color: "red" | "green";
  /** Click handler function */
  onClick: () => void;
  /** Whether the button is disabled (default: false) */
  disabled?: boolean;
}

//-----------------------------------------------------------------------------//
/**
 * A styled button component used in modal dialogs.
 *
 * Applies dynamic color styling and supports disabling the button.
 */
//-----------------------------------------------------------------------------//
export default function ModalButton({
  text,
  onClick,
  color,
  disabled = false,
}: Props) {
  // Dynamically pick the color-specific CSS class
  const colorClass = styles[`modal-btn--${color}`];

  return (
    <button
      className={`${styles["modal-btn"]} ${colorClass}`}
      role="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
