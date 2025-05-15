import { FullTeamObject } from "@/types/team";
import styles from "./TeamCardInGame.module.css";
import PlayerRow from "@/app/components/GamePageComponents/PlayerRow/PlayerRow";
interface Props {
  team: FullTeamObject;
}

export default function TeamCardInGame({ team }: Props) {
  return (
    <div className={styles["team"]}>
      <h2>{team.team.team_name}</h2>
      <div className={styles.playersList}>
        {team.players.map((pl) => (
          <PlayerRow key={pl.player_id} player={pl} />
        ))}
      </div>
    </div>
  );
}
