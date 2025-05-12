//-----------------------------------------------------------------------------//
// ModalSelect Component
// A reusable styled <select> element for use in modals
//-----------------------------------------------------------------------------//

import styles from "./ModalSelect.module.css";

//-----------------------------------------------------------------------------//
// Props Interface
//-----------------------------------------------------------------------------//

/**
 * Props for the ModalSelect component.
 *
 * @property {string} value - The currently selected value.
 * @property {(newValue: string) => void} onChange - Callback when the selected value changes.
 * @property {{ label: string; value: string }[]} options - Options to display in the dropdown.
 * @property {string} [label] - Optional label text shown above the select.
 * @property {string} [placeholder] - Placeholder shown as the first option.
 * @property {boolean} [required] - Whether the field is required.
 */
interface ModalSelectProps {
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

//-----------------------------------------------------------------------------//
// Component Definition
//-----------------------------------------------------------------------------//

/**
 * A reusable select dropdown component styled for use in modals.
 *
 * @param {ModalSelectProps} props - Props to control the select input behavior.
 * @returns {JSX.Element} A labeled select input for use in modal forms.
 */
export default function ModalSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}: ModalSelectProps) {
  return (
    <div className={styles.selectGroup}>
      {/* Optional label with required indicator */}
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      {/* Main select element */}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
