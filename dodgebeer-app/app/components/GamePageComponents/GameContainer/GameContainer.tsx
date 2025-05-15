import styles from "./GameContainer.module.css";
import TeamCardInGame from "@/app/components/GamePageComponents/TeamCardInGame/TeamCardInGame";
import { FullTeamObject } from "@/types/team";
interface Props {
  team1: FullTeamObject;
  team2: FullTeamObject;
}
export default function GameContainer({ team1, team2 }: Props) {
  return (
    <>
      <h1 className={styles["round-text"]}>Round 1</h1>
      <div className={styles["game-container"]}>
        <div className={styles["team-card-container"]}>
          <TeamCardInGame team={team1} />
          <TeamCardInGame team={team2} />
        </div>
      </div>
    </>
  );
}
