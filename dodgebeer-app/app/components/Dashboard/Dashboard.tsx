"use client";

import styles from "./Dashboard.module.css";
import DashboardButton from "@/app/components/ui/DashboardButton/DashboardButton";
import { useState } from "react";
import CreateGameModal from "@/app/components/DashboardPageComponents/CreateGameModal/CreateGameModal";
export default function Dashboard() {
  const cur_year = new Date().getFullYear();
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);

  async function newGameCreation(team1: string, team2: string) {
    setIsCreateGameModalOpen(false);
  }
  async function clearDataClick() {}
  return (
    <>
      <div className={styles["dashboard-container"]}>
        <div className={styles["top-elements"]}>
          <h1 id={styles["welcome-text"]}>Welcome to Dodge Beer {cur_year}</h1>
          <div className={styles["button-group"]}>
            <DashboardButton
              text={"New Game"}
              color={"green"}
              onClick={() => setIsCreateGameModalOpen(true)}
            />
            <DashboardButton
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
    </>
  );
}
