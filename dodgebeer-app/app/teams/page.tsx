"use client";
import React, { useState, useEffect } from "react";
import TeamCard from "@/app/components/ui/TeamCard/TeamCard";
import { ApiClient } from "@/app/api/all-routes";

import styles from "@/app/teams/page.module.css";
import { ApiResponse, ResponseWithErrorInData } from "@/types/api";
import { GetAllTeamsResponse } from "@/types/team";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TeamsPage() {
  const [data, setData] = useState<GetAllTeamsResponse | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchTeams() {
      // try to get response and set data
      try {
        const response = await ApiClient.GetAllTeams();
        const result = (await response.json()) as ApiResponse<
          GetAllTeamsResponse | ResponseWithErrorInData
        >;

        if (response.status !== 200 || !result.success) {
          console.error(
            "API Error in fetchTeams():",
            (result.data as ResponseWithErrorInData).error,
          );
          setIsError(true);
          return;
        }

        setData(result.data as GetAllTeamsResponse);
      } catch (err) {
        // failed at some point
        console.error("Fetch error:", err);
        setIsError(true);
      } finally {
        // loading stop
        setIsLoading(false);
      }
    }

    fetchTeams();
  }, []);

  //-----------------------------------------------------------------------------//
  if (isLoading) {
    return (
      <div className={styles["teams-container"]}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className={styles["skeleton-card"]}>
            <Skeleton
              height={450}
              borderRadius={16}
              containerClassName={"flex-1"}
            />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles["teams-container"]}>Failed to load teams.</div>
    );
  }

  const teamEntries = Object.entries(data.teams);
  const hasTeams = teamEntries.length > 0;

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
