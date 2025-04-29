import styles from "./TeamCard.module.css";

interface TeamProps {
  team_name: string;
  players: string[];
}
export default function TeamCard({ team_name, players }: TeamProps) {
  return (
    <div className={styles.teamCard}>
      <div className={styles.teamName}>{team_name}</div>
      <div className={styles.playersList}>
        {players.map((player, idx) => (
          <div className={styles.playerRow} key={idx}>
            {/*<img*/}
            {/*  src={player.photo || "/default-player.png"}*/}
            {/*  alt={player.name}*/}
            {/*  className={styles.playerImage}*/}
            {/*/>*/}
            <span className={styles.playerName}>{player}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
