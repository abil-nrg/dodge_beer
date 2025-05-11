//-----------------------------------------------------------------------------//
/** TEAM CARD COMPONENT */
//-----------------------------------------------------------------------------//

// styles & icons
import styles from "./TeamCard.module.css";
import { MdDelete } from "react-icons/md";

// react
import { useEffect, useState } from "react";

// types
import { MainDataConfig, Player } from "@/types/main-data";

// util & util components
import { deleteObjectConfirmationBox } from "@/app/util/confirmation-box";
import type { toast as customToast } from "@/app/util/toast-alert-config";

// services
import {
  addNewPlayerToTeam,
  deleteTeamService,
  removePlayerFromTeam,
} from "@/app/services/teamService";
import PlayerRowInTeamCard from "@/app/components/TeamCard/TeamCardElements/PlayerRowInTeamCard/PlayerRowInTeamCard";
import AddPlayerToTeamCardButton from "@/app/components/TeamCard/TeamCardElements/AddPlayerToTeamCardButton/AddPlayerToTeamCardButton";
import AddPlayerToTeamCardModal from "@/app/components/TeamCard/TeamCardElements/AddPlayerToTeamCardModal/AddPlayerToTeamCardModal";
import { getPlayersMapFromIds } from "@/app/services/playerService";

//-----------------------------------------------------------------------------//
/** Default fallback photo for players with missing image */
//-----------------------------------------------------------------------------//
const DEFAULT_PHOTO = MainDataConfig.DEFAULT_PHOTO;

//-----------------------------------------------------------------------------//
/** Props for the TeamCard component */
//-----------------------------------------------------------------------------//
interface TeamProps {
  /** ID of the team */
  team_id: string;
  /** Display name of the team */
  team_name: string;
  /** Array of player IDs belonging to this team */
  playerIds: string[];
  /** State setter for updating the list of player IDs */
  setPlayerIds: (ids: string[]) => void;
  /** Callback to trigger after a team is deleted */
  onTeamDelete: () => void;
  /** Optional toast alert object for displaying feedback */
  toast_alert?: typeof customToast;
}

//-----------------------------------------------------------------------------//
/**
 * Displays a styled card for a team, including team name,
 * delete button, and all associated players.
 *
 * Handles player fetch, deletion confirmation, and local updates.
 */
//-----------------------------------------------------------------------------//
export default function TeamCard({
  team_id,
  team_name,
  playerIds,
  setPlayerIds,
  onTeamDelete,
  toast_alert,
}: TeamProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  //-----------------------------------------------------------------------------//
  /** Fetch all players on mount and when playerIds change */
  //-----------------------------------------------------------------------------//
  useEffect(() => {
    let isMounted = true;

    async function fetchAndSetPlayers() {
      const newPlayers = await getPlayersMapFromIds(playerIds);
      if (isMounted) {
        setPlayers(newPlayers);
      }
    }

    fetchAndSetPlayers();

    return () => {
      isMounted = false;
    };
  }, [playerIds]);

  //-----------------------------------------------------------------------------//
  /** Opens a modal for adding new player */
  //-----------------------------------------------------------------------------//
  function handlePlayerAddedClick(player_id: string) {
    addNewPlayerToTeam(team_id, player_id);
    setPlayerIds([...playerIds, player_id]);
    setIsModalOpen(false);
  }

  //-----------------------------------------------------------------------------//
  /** Toggles selection (highlight) state of this card */
  //-----------------------------------------------------------------------------//
  function toggleCardSelection() {
    setIsSelected((prev) => !prev);
  }

  //-----------------------------------------------------------------------------//
  /** Deletes a player from the team after confirmation */
  //-----------------------------------------------------------------------------//
  async function removePlayerFromTeamHandler(player_id: string) {
    const deleteConfirmation = await deleteObjectConfirmationBox();
    if (deleteConfirmation) {
      const result = await removePlayerFromTeam(player_id, team_id);
      if (Array.isArray(result)) {
        setPlayerIds(result);
        toast_alert?.success("Player removed from team.");
      } else if (typeof result === "string") {
        toast_alert?.error(result);
      }
    }
  }

  //-----------------------------------------------------------------------------//
  /** Deletes the entire team after confirmation */
  //-----------------------------------------------------------------------------//
  async function deleteTeamHandler() {
    const deleteConfirmation = await deleteObjectConfirmationBox();
    if (deleteConfirmation) {
      const result = await deleteTeamService(team_id);
      if (typeof result === "boolean") {
        onTeamDelete();
        toast_alert?.success("Team deleted.");
      } else {
        toast_alert?.error(result);
      }
    }
  }

  //-----------------------------------------------------------------------------//
  /** Render JSX */
  //-----------------------------------------------------------------------------//
  return (
    <div
      className={`${styles.teamCard} ${isSelected ? styles.activeCard : ""}`}
      onClick={toggleCardSelection}
    >
      <div className={styles.teamName}>
        {team_name}
        <button
          className={styles.deleteTeam}
          onClick={(e) => {
            e.stopPropagation();
            deleteTeamHandler();
          }}
        >
          <MdDelete />
        </button>
      </div>
      <div className={styles.playersList}>
        {playerIds.map((player_id) => {
          const player = players[player_id];
          return (
            <PlayerRowInTeamCard
              key={player_id}
              player={player}
              playerId={player_id}
              onPlayerDelete={() => removePlayerFromTeamHandler(player_id)}
              defaultOptions={{ name: player_id, photo: DEFAULT_PHOTO }}
            />
          );
        })}
      </div>
      <div className={styles.addPlayerElem}>
        <AddPlayerToTeamCardButton onOpenModal={() => setIsModalOpen(true)} />
      </div>
      {/*Opens a modal for adding new player*/}
      {isModalOpen && (
        <AddPlayerToTeamCardModal
          onSuccess={handlePlayerAddedClick}
          onClose={() => setIsModalOpen(false)}
          toast_alert={toast_alert}
        />
      )}
    </div>
  );
}
