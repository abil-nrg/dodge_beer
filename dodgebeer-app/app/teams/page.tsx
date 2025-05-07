"use client";
import React, { useState, useEffect } from "react";
import TeamCard from "@/app/components/ui/TeamCard/TeamCard";
import { ApiClient } from "@/app/api/all-routes";

import styles from "@/app/teams/page.module.css";
import { GetAllTeamsResponse } from "@/types/api";
export default function TeamsPage() {
  const [data, setData] = useState<GetAllTeamsResponse | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchTeams() {
      const response = await ApiClient.GetAllTeams();
      if (response.status !== 200) {
        setIsError(true);
        return;
      }

      const data = (await response.json()) as GetAllTeamsResponse;
      console.log(data);
      setData(data || []);
    }

    fetchTeams();
  }, []);

  // loading state
  if (!data) {
    return <div>Loading...</div>;
  }

  const hasTeams = Object.entries(data.teams).length > 0;
  const teamEntries = Object.entries(data.teams);

  return (
    <div className={styles["teams-container"]}>
      {hasTeams ? (
        teamEntries.map(([teamId, team]) => (
          <TeamCard
            key={teamId}
            team_id={teamId}
            team_name={team.team_name}
            playerIds={team.players}
          />
        ))
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}
