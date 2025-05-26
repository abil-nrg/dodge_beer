// app/components/ui/TeamCard/TeamCardContainer.tsx

//-----------------------------------------------------------------------------//
/** TEAM CARD CONTAINER */
//-----------------------------------------------------------------------------//

// react
import { useState } from "react";

// components
import TeamCard from "./TeamCard";
import type { toast as customToast } from "@/app/util/toast-alert-config";

//-----------------------------------------------------------------------------//
/** Props for the TeamCardContainer component */
//-----------------------------------------------------------------------------//
interface TeamCardContainerProps {
  /** Unique ID of the team */
  team_id: string;

  /** Name of the team */
  team_name: string;

  /** Initial list of player IDs associated with the team */
  initialPlayerIds: string[];

  /** Callback triggered when the team is deleted */
  onDelete: () => void;

  /** Optional toast alert object for showing notifications */
  toast_alert?: typeof customToast;
}

//-----------------------------------------------------------------------------//
/**
 * Wraps TeamCard with local state management for player IDs.
 * Allows TeamCard to update its player list without re-fetching from the server.
 */
//-----------------------------------------------------------------------------//
export default function TeamCardContainer({
  team_id,
  team_name,
  initialPlayerIds,
  onDelete,
  toast_alert,
}: TeamCardContainerProps) {
  const [playerIds, setPlayerIds] = useState<string[]>(initialPlayerIds);

  return (
    <TeamCard
      team_id={team_id}
      team_name={team_name}
      playerIds={playerIds}
      setPlayerIds={setPlayerIds}
      onTeamDelete={onDelete}
      toast_alert={toast_alert}
    />
  );
}
