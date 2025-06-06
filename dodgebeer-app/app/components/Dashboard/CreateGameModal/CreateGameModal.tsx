import BaseModal from "@/app/components/BaseModal/BaseModal";
import ModalSelect from "@/app/components/ui/ModalSelect/ModalSelect";
import { useEffect, useState } from "react";
import { ApiClient } from "@/app/api/all-routes";
import { ApiResponse, ResponseWithErrorInData } from "@/types/api";
import { GetAllTeamsResponse } from "@/types/team";
import ModalButton from "@/app/components/ui/ModalButton/ModalButton";
import styles from "./CreateGameModal.module.css";

interface Props {
  onClose: () => void;
  onSuccess: (team1: string, team2: string) => void;
}
export default function CreateGameModal({ onClose, onSuccess }: Props) {
  const [teams, setTeams] = useState<GetAllTeamsResponse["teams"]>({});
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");

  //-----------------------------------------------------------------------------//
  /** Fetch team data from API on mount */
  //-----------------------------------------------------------------------------//
  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await ApiClient.GetAllTeamsRoute();
        const result = (await response.json()) as ApiResponse<
          GetAllTeamsResponse | ResponseWithErrorInData
        >;

        if (response.status !== 200 || !result.success) {
          console.error(
            "API Error in fetchTeams():",
            (result.data as ResponseWithErrorInData).error,
          );
          return;
        }
        setTeams((result.data as GetAllTeamsResponse).teams);
      } catch (err) {
        console.error("Fetch error in TeamsPage:", err);
      }
    }

    fetchTeams();
  }, []);

  const teamEntries = Object.entries(teams);
  const team2Options = teamEntries.filter(([id]) => id !== team1Id);

  return (
    <BaseModal title={"Create Game"} onClose={onClose}>
      <ModalSelect
        label="Team 1"
        value={team1Id}
        onChange={setTeam1Id}
        options={teamEntries.map(([id, team]) => ({
          value: id,
          label: team.team_name,
        }))}
      />
      <ModalSelect
        label="Team 2"
        value={team2Id}
        onChange={setTeam2Id}
        options={team2Options.map(([id, team]) => ({
          value: id,
          label: team.team_name,
        }))}
      />
      <div className={styles.buttonRow}>
        <ModalButton
          text={"Play!"}
          onClick={() => onSuccess(team1Id, team2Id)}
          color={"green"}
          disabled={!team1Id || !team2Id}
        />
        <ModalButton text={"Cancel"} onClick={() => onClose()} color={"red"} />
      </div>
    </BaseModal>
  );
}
