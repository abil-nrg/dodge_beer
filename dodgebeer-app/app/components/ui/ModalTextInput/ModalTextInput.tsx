// app/components/ui/ModalTextInput/ModalTextInput.tsx

//-----------------------------------------------------------------------------//
// ModalTextInput Component
// A reusable labeled input component for modals
//-----------------------------------------------------------------------------//

// styles
import styles from "./ModalTextInput.module.css";
// react
import { ChangeEvent } from "react";

//-----------------------------------------------------------------------------//
// Props Interface
//-----------------------------------------------------------------------------//

interface ModalTextInputProps {
  label: string; // Label displayed above the input
  value: string; // Current input value
  onChange: (newValue: string) => void; // Called when input changes
  placeholder?: string; // Optional placeholder text
  required?: boolean; // Whether the input is required
  type?: "text" | "email" | "password"; // Input type (default: "text")
}

//-----------------------------------------------------------------------------//
// ModalTextInput Component
//-----------------------------------------------------------------------------//

export default function ModalTextInput({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
}: ModalTextInputProps) {
  /**
   * Handles the native input change event
   * and passes the new value up to the parent.
   */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className={styles.inputGroup}>
      {/* Label with optional required asterisk */}
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      {/* Controlled input element */}
      <input
        type={type}
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
