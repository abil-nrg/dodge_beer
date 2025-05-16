import { FullTeamObject } from "@/types/team";
import styles from "./TeamCardInGame.module.css";
import PlayerRow from "@/app/components/GamePageComponents/PlayerRow/PlayerRow";
interface Props {
  team: FullTeamObject;
  onPlayerHit: (team_id: string, player_id: string, time?: number) => void;
  onPlayerSave: (team_id: string, player_id: string, time?: number) => void;
}

export default function TeamCardInGame({
  team,
  onPlayerHit,
  onPlayerSave,
}: Props) {
  async function playerHitClicked(player_id: string, time?: number) {
    onPlayerHit(team.team.team_id, player_id, time);
  }
  async function playerSaveClicked(player_id: string, time?: number) {
    onPlayerSave(team.team.team_id, player_id, time);
  }
  return (
    <div className={styles["team"]}>
      <h2>{team.team.team_name}</h2>
      <div className={styles.playersList}>
        {team.players.map((pl) => (
          <PlayerRow
            key={pl.player_id}
            player={pl}
            onHitClick={playerHitClicked}
            onSaveClick={playerSaveClicked}
          />
        ))}
      </div>
    </div>
  );
}
