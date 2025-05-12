// app/components/BaseModal/BaseModal.tsx
//-----------------------------------------------------------------------------//
/** BASE MODAL COMPONENT */
//-----------------------------------------------------------------------------//

import styles from "./BaseModal.module.css";

//-----------------------------------------------------------------------------//
/**
 * Props for the BaseModal component
 *
 * @property title - Modal title displayed at the top
 * @property onClose - Callback fired when clicking outside the modal content
 * @property children - JSX content rendered inside the modal body
 */
//-----------------------------------------------------------------------------//
interface BaseModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

//-----------------------------------------------------------------------------//
/**
 * BaseModal provides a reusable, centered modal layout with a title,
 * backdrop click-to-close behavior, and a content slot for custom UI.
 *
 * Use this as a wrapper for specific modal forms (e.g., adding players, renaming teams).
 */
//-----------------------------------------------------------------------------//
export default function BaseModal({
  title,
  onClose,
  children,
}: BaseModalProps) {
  return (
    // Backdrop area closes the modal if clicked
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{title}</h3>

        {/* Modal body where content is injected */}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
