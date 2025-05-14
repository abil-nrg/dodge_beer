"use client";
import styles from "./page.module.css";
import React, { useEffect, useState, useCallback } from "react";
import {
  deletePlayerById,
  fetchAllPlayers,
} from "@/app/services/playerService";
import { PlayerWithId } from "@/types/player";
import PlayerCard from "@/app/components/PlayersPageComponents/PlayerCard/PlayerCard";
import { ToastContainerCustom, toast } from "@/app/util/toast-alert-config";
import AddNewPlayerModal from "@/app/components/PlayersPageComponents/AddNewPlayerModal/AddNewPlayerModal";
import { IoMdAdd } from "react-icons/io";
import { ApiClient } from "@/app/api/all-routes";
import { deleteObjectConfirmationBox } from "@/app/util/confirmation-box";

export default function PlayersPages() {
  const [players, setPlayers] = useState<PlayerWithId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //-----------------------------------------------------------------------------//
  /** Fetch players from backend and update state */
  //-----------------------------------------------------------------------------//
  const fetchPlayers = useCallback(async () => {
    const playerObjects = (await fetchAllPlayers()).players;

    const allPlayers: PlayerWithId[] = Object.entries(playerObjects).map(
      ([id, player]) => ({
        player_id: id,
        player,
      }),
    );

    setPlayers(allPlayers);
  }, []);

  // Run once on mount
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  //-----------------------------------------------------------------------------//
  /** Deletes player and refreshes the list */
  //-----------------------------------------------------------------------------//
  async function handlePlayerDeletion(player_id: string) {
    const deleteConfirmation = await deleteObjectConfirmationBox();
    if (deleteConfirmation) {
      deletePlayerById(player_id);
      await fetchPlayers();
      toast.success("They probably sucked anyway!");
    }
  }

  async function handleAddNewPlayerModal(playerName: string, photo?: string) {
    await ApiClient.addNewPlayerRoute(playerName, photo);

    await fetchPlayers();
    toast.success("Player Added!");
  }

  async function handlePLayerPhotoUpload(photo: File) {
    const formData = new FormData();
    formData.append("photo", photo);

    await ApiClient.uploadPhotoRoute(formData);
  }
  return (
    <>
      <div className={styles["players-container"]}>
        {players.length > 0 ? (
          players.map((p) => (
            <PlayerCard
              key={p.player_id}
              id={p.player_id}
              name={p.player.name}
              photo={p.player.photo}
              onPlayerDelete={() => handlePlayerDeletion(p.player_id)}
            />
          ))
        ) : (
          <div>Nothing here</div>
        )}
      </div>
      <button
        className={styles["add-player-button"]}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <IoMdAdd />
      </button>
      {isModalOpen && (
        <AddNewPlayerModal
          onSuccess={handleAddNewPlayerModal}
          onClose={() => setIsModalOpen(false)}
          handleFileUpload={(photoFile) => handlePLayerPhotoUpload(photoFile)}
          toast_alert={toast}
        />
      )}
      <ToastContainerCustom />
    </>
  );
}
