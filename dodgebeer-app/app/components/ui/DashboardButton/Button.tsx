//-----------------------------------------------------------------------------//
import styles from "./Button.module.css";

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
  /** Size of button */
  size?: "regular" | "large";
  /** A little more transparent */
  transparent?: boolean;
}

export default function Button({
  text,
  onClick,
  color,
  disabled = false,
  size = "regular",
  transparent = false,
}: Props) {
  // Dynamically pick the color-specific CSS class
  const colorClass = styles[`btn--${color}`];
  const sizeClass = size === "large" ? styles["btn--large"] : "";
  const transparentClass = transparent ? styles["btn--transparent"] : "";

  return (
    <button
      className={`${styles["btn"]} ${colorClass} ${sizeClass} ${transparentClass}`}
      role="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
