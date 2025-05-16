"use client";

import styles from "./Dashboard.module.css";
import Button from "@/app/components/ui/DashboardButton/Button";
import React, { useState } from "react";
import CreateGameModal from "@/app/components/DashboardPageComponents/CreateGameModal/CreateGameModal";
import { createNewGameService } from "@/app/services/gameService";
import { useRouter } from "next/navigation";

import { toast, ToastContainerCustom } from "@/app/util/toast-alert-config";
export default function Dashboard() {
  const router = useRouter();

  const cur_year = new Date().getFullYear();
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);

  async function newGameCreation(team1: string, team2: string) {
    setIsCreateGameModalOpen(false);
    try {
      const gameId = await createNewGameService(team1, team2);
      router.push(`/game/${gameId}`);
    } catch (error) {
      toast.error("Could not create game!");
    }
  }
  async function clearDataClick() {}
  return (
    <>
      <div className={styles["dashboard-container"]}>
        <div className={styles["top-elements"]}>
          <h1 id={styles["welcome-text"]}>Welcome to Dodge Beer {cur_year}</h1>
          <div className={styles["button-group"]}>
            <Button
              text={"New Game"}
              color={"green"}
              onClick={() => setIsCreateGameModalOpen(true)}
            />
            <Button
              text={"Clear Data"}
              color={"red"}
              onClick={clearDataClick}
            />
          </div>
        </div>
        <div className={styles["content"]}></div>
      </div>
      {isCreateGameModalOpen && (
        <CreateGameModal
          onSuccess={newGameCreation}
          onClose={() => setIsCreateGameModalOpen(false)}
        />
      )}
      <ToastContainerCustom />
    </>
  );
}
