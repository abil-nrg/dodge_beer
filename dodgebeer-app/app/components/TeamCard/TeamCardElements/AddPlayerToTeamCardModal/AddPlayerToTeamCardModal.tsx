import styles from "./AddPlayerToTeamCardModal.module.css";
import { useEffect, useState } from "react";
import ModalButton from "@/app/components/ui/ModalButton/ModalButton";
import { fetchAllAvailablePlayers } from "@/app/services/playerService";
import { PlayerWithId } from "@types/player";
import type { toast as customToast } from "@/app/util/toast-alert-config";

interface Props {
  onSuccess: (playerId: string) => void;
  onClose: () => void;
  toast_alert?: typeof customToast;
}

export default function AddPlayerToTeamCardModal({
  onSuccess,
  onClose,
  toast_alert,
}: Props) {
  const [players, setPlayers] = useState<PlayerWithId[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  useEffect(() => {
    async function fetchAvailablePlayers() {
      try {
        const players = await fetchAllAvailablePlayers();
        setPlayers(players);
      } catch {
        toast_alert?.error("Couldn't load any available players");
      }
    }

    fetchAvailablePlayers();
  }, []);

  async function handleSubmit() {
    if (!selectedPlayerId) {
      toast_alert?.warn("Please select a player");
      return;
    }
    toast_alert?.success("Add new player to this team!");
    onSuccess(selectedPlayerId);
    onClose();
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Select a player to add</h3>

        <select
          className={styles.customSelect}
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          <option value="">Select Player</option>
          {players.map((p, id) => (
            <option key={id} value={p.player_id}>
              {p.player.name}
            </option>
          ))}
        </select>

        <div className={styles.buttonRow}>
          <ModalButton
            text="Submit"
            onClick={handleSubmit}
            color="green"
            disabled={!selectedPlayerId}
          />
          <ModalButton text="Cancel" onClick={onClose} color="red" />
        </div>
      </div>
    </div>
  );
}
