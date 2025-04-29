"use client";
import React, { useState, useEffect } from "react";
import TeamCard from "@/app/components/ui/TeamCard/TeamCard";
import { API_ROUTE } from "@/app/api/all-routes";
import { GetAllTeamsResponse } from "@backend/config/types";
import styles from "@/app/teams/page.module.css";
export default function TeamsPage() {
  const [data, setData] = useState<GetAllTeamsResponse | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchTeams() {
      const response = await fetch(API_ROUTE.GET_ALL_TEAMS, { method: "GET" });
      const result = await response.json();
      if (result.status !== 200) {
        setIsError(true);
        return;
      }
      const data = result.data as GetAllTeamsResponse;

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
            team_name={team.team_name}
            players={team.players}
          />
        ))
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}
