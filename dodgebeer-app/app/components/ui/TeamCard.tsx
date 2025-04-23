import { Team } from "@/backend/config/config";

export default function TeamCard({ team_name, players }: Team) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white fw-bold">{team_name}</div>

      <div className="card-body">
        <div className="d-flex flex-wrap gap-3 p-3 rounded bg-light">
          {players.map((player, index) => (
            <div
              key={index}
              className="d-flex flex-column align-items-center text-center"
              style={{ width: 100 }}
            >
              <img
                src={player.photo}
                alt={player.name}
                className="rounded-circle mb-2"
                width="64"
                height="64"
                style={{ objectFit: "cover", border: "2px solid #dee2e6" }}
              />
              <small className="fw-semibold">{player.name}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
