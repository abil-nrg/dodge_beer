import styles from "./AddPlayerToTeamCardModal.module.css";
import { useEffect, useState } from "react";
import ModalButton from "@/app/components/ui/ModalButton/ModalButton";
import { fetchAllAvailablePlayers } from "@/app/services/playerService";
import { PlayerWithId } from "@/types/player";
import type { toast as customToast } from "@/app/util/toast-alert-config";
import BaseModal from "@/app/components/BaseModal/BaseModal";
import ModalSelect from "@/app/components/ui/ModalSelect/ModalSelect";

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
    <BaseModal title="Select a player to add" onClose={onClose}>
      <ModalSelect
        value={selectedPlayerId}
        onChange={setSelectedPlayerId}
        options={players.map((p) => ({
          value: p.player_id,
          label: p.player.name,
        }))}
        placeholder="Select Player"
        required
      />

      <div className={styles.buttonRow}>
        <ModalButton
          text="Submit"
          onClick={handleSubmit}
          color="green"
          disabled={!selectedPlayerId}
        />
        <ModalButton text="Cancel" onClick={onClose} color="red" />
      </div>
    </BaseModal>
  );
}
