//-----------------------------------------------------------------------------//
import styles from "./DashboardButton.module.css";

/** Props for the Button component */
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

export default function DashboardButton({
  text,
  onClick,
  color,
  disabled = false,
}: Props) {
  // Dynamically pick the color-specific CSS class
  const colorClass = styles[`btn--${color}`];

  return (
    <button
      className={`${styles["btn"]} ${colorClass}`}
      role="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
