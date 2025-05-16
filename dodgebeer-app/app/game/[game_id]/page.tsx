"use client";

import React, { useEffect, useState } from "react";
import { ApiClient } from "@/app/api/all-routes";
import { ApiResponse } from "@/types/api";
import { FullTeamObject, GetBothTeamsResponse } from "@/types/team";
import GameContainer from "@/app/components/GamePageComponents/GameContainer/GameContainer";

export default function GamePage({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) {
  const { game_id } = React.use<{ game_id: string }>(params);

  const [team1, setTeam1] = useState<FullTeamObject>();
  const [team2, setTeam2] = useState<FullTeamObject>();

  useEffect(() => {
    let isMounted = true;

    async function getBothTeamsInfo() {
      const response = await ApiClient.getBothTeamsInfoByGameIdRoute(game_id);
      const result =
        (await response.json()) as ApiResponse<GetBothTeamsResponse>;
      const data = result.data;

      if (isMounted) {
        setTeam1(data.team1);
        setTeam2(data.team2);
      }
    }

    getBothTeamsInfo();

    return () => {
      isMounted = false;
    };
  }, [game_id]);

  if (!team1 || !team2) {
    return <div>Loading game data...</div>;
  }
  return (
    <div>
      <GameContainer gameId={game_id} team1={team1} team2={team2} />
    </div>
  );
}
