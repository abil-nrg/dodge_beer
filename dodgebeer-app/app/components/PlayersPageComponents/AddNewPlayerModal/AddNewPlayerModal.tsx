import BaseModal from "@/app/components/BaseModal/BaseModal";
import { type toast as customToast } from "@/app/util/toast-alert-config";
import ModalTextInput from "@/app/components/ui/ModalTextInput/ModalTextInput";
import { useState } from "react";
import styles from "./AddNewPlayerModal.module.css";
import ModalButton from "@/app/components/ui/ModalButton/ModalButton";

interface Props {
  onSuccess: (playerName: string, photo?: string) => void; // Callback when player is successfully added
  onClose: () => void; // Callback to close the modal
  handleFileUpload: (photoFile: File) => void;
  toast_alert?: typeof customToast; // Optional toast alert instance for feedback
}
export default function AddNewPlayerModal({
  onSuccess,
  onClose,
  handleFileUpload,
}: Props) {
  const [playerName, setPlayerName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  async function handleSubmit() {
    if (!playerName) return;
    if (photoFile) {
      handleFileUpload(photoFile);
    }
    onSuccess(playerName, photoFile?.name);
    onClose();
  }
  return (
    <>
      <BaseModal title={"Add New Player"} onClose={onClose}>
        <ModalTextInput
          value={playerName}
          onChange={setPlayerName}
          placeholder={"Enter player name here"}
          label={"Player Name"}
          required
        />
        <input
          id="player-photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className={styles.fileInput}
        />
        <label htmlFor="player-photo" className={styles.fileInputLabel}>
          {photoFile ? `📸 ${photoFile.name}` : "📷 Upload player photo"}
        </label>

        {/* Button row with Submit and Cancel */}
        <div className={styles.buttonRow}>
          <ModalButton
            text="Submit"
            onClick={handleSubmit}
            color="green"
            disabled={!playerName} // Disable if input is empty
          />
          <ModalButton text="Cancel" onClick={onClose} color="red" />
        </div>
      </BaseModal>
    </>
  );
}
