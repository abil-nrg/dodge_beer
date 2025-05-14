// app/teams/page.tsx
"use client";

// react
import React, { useState, useEffect } from "react";
// loading skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// toastify alerts
import { ToastContainerCustom, toast } from "@/app/util/toast-alert-config";
// styles
import { IoMdAdd } from "react-icons/io";
import styles from "@/app/teams/page.module.css";
// utils
import { createTeam } from "@/app/services/teamService";
import { ApiClient } from "@/app/api/all-routes";
// components
import TeamCardContainer from "@/app/components/TeamCard/TeamCardContainer";
import AddNewTeamModal from "@/app/components/TeamPageComponents/AddNewTeamModal/AddNewTeamModal";
// types
import { ApiResponse, ResponseWithErrorInData } from "@/types/api";
import { GetAllTeamsResponse } from "@/types/team";

//-----------------------------------------------------------------------------//
/** TEAMS PAGE COMPONENT */
//-----------------------------------------------------------------------------//

/**
 * Displays all team cards with loading and error handling.
 * Fetches team data on mount and allows individual team deletion.
 */
export default function TeamsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [teams, setTeams] = useState<GetAllTeamsResponse["teams"]>({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          setIsError(true);
          return;
        }
        setTeams((result.data as GetAllTeamsResponse).teams);
      } catch (err) {
        console.error("Fetch error in TeamsPage:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeams();
  }, [refreshTrigger]);

  //-----------------------------------------------------------------------------//
  /** Triggers team refresh */
  //-----------------------------------------------------------------------------//
  function triggerTeamRefresh() {
    setRefreshTrigger((prev) => prev + 1);
  }

  //-----------------------------------------------------------------------------//
  /** Remove a team from local state when it's deleted */
  //-----------------------------------------------------------------------------//
  async function handleTeamDeleted(teamId: string) {
    setTeams((prev) => {
      const updated = { ...prev };
      delete updated[teamId];
      return updated;
    });
  }

  //-----------------------------------------------------------------------------//
  /** Add a new Team */
  //-----------------------------------------------------------------------------//
  async function handleNewTeamAddClick(teamName: string) {
    await createTeam(teamName);
    triggerTeamRefresh();
  }

  //-----------------------------------------------------------------------------//
  /** Render loading skeleton */
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

  //-----------------------------------------------------------------------------//
  /** Render error state */
  //-----------------------------------------------------------------------------//
  if (isError || !teams) {
    return (
      <div className={styles["teams-container"]}>Failed to load teams.</div>
    );
  }

  //-----------------------------------------------------------------------------//
  /** Render team cards */
  //-----------------------------------------------------------------------------//
  const teamEntries = Object.entries(teams);
  const hasTeams = teamEntries.length > 0;

  return (
    <>
      <div className={styles["teams-container"]}>
        {hasTeams ? (
          teamEntries.map(([teamId, team]) => (
            <TeamCardContainer
              key={teamId}
              team_id={teamId}
              team_name={team.team_name}
              initialPlayerIds={team.players}
              onDelete={() => handleTeamDeleted(teamId)}
              toast_alert={toast}
            />
          ))
        ) : (
          <div>Nothing here</div>
        )}
        <button
          className={styles["add-team-button"]}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <IoMdAdd />
        </button>
        {/*Opens a modal for adding new team*/}
        {isModalOpen && (
          <AddNewTeamModal
            onSuccess={handleNewTeamAddClick}
            onClose={() => setIsModalOpen(false)}
            toast_alert={toast}
          />
        )}
      </div>
      <ToastContainerCustom />
    </>
  );
}
