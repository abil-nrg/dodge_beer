//-----------------------------------------------------------------------------//
// Imports
//-----------------------------------------------------------------------------//

// react
import { useState } from "react";
// components
import BaseModal from "@/app/components/BaseModal/BaseModal";
import ModalButton from "@/app/components/ui/ModalButton/ModalButton";
import ModalTextInput from "@/app/components/ui/ModalTextInput/ModalTextInput";
//types
import type { toast as customToast } from "@/app/util/toast-alert-config";
// styles
import styles from "./AddNewTeamModal.module.css";

//-----------------------------------------------------------------------------//
// Props Interface
//-----------------------------------------------------------------------------//

interface Props {
  onSuccess: (teamName: string) => void; // Callback when team is successfully added
  onClose: () => void; // Callback to close the modal
  toast_alert?: typeof customToast; // Optional toast alert instance for feedback
}

//-----------------------------------------------------------------------------//
// AddNewTeamModal Component
//-----------------------------------------------------------------------------//

export default function AddNewTeamModal({
  onSuccess,
  onClose,
  toast_alert,
}: Props) {
  // Local state to store the team name input
  const [teamName, setTeamName] = useState("");

  /**
   * Handles the form submission:
   * - Shows success toast (if provided)
   * - Calls onSuccess callback with team name
   * - Closes the modal
   */
  async function handleSubmit() {
    if (!teamName) return; // Prevent submission with empty name
    toast_alert?.success("New Team added!");
    onSuccess(teamName);
    onClose();
  }

  return (
    <BaseModal title={"Add a new team"} onClose={onClose}>
      {/* Input for team name */}
      <ModalTextInput
        value={teamName}
        onChange={setTeamName}
        placeholder={"Enter team name here"}
        label={"Team Name"}
        required
      />

      {/* Button row with Submit and Cancel */}
      <div className={styles.buttonRow}>
        <ModalButton
          text="Submit"
          onClick={handleSubmit}
          color="green"
          disabled={!teamName} // Disable if input is empty
        />
        <ModalButton text="Cancel" onClick={onClose} color="red" />
      </div>
    </BaseModal>
  );
}
