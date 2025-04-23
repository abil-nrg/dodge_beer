import TeamCard from "../components/ui/TeamCard";

export default function TeamsPage() {
  const teams = [
    {
      teamName: "Thunder Bros",
      players: [
        { name: "Max", photo: "/avatars/max.png" },
        { name: "Lena", photo: "/avatars/lena.png" },
        { name: "Jules", photo: "/avatars/jules.png" },
        { name: "Dana", photo: "/avatars/dana.png" },
      ],
    },
    {
      teamName: "Beer Bashers",
      players: [
        { name: "Mike", photo: "/avatars/mike.png" },
        { name: "Sara", photo: "/avatars/sara.png" },
      ],
    },
  ];
  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Teams</h2>
      {teams.map((team, i) => (
        <TeamCard key={i} team_name={team.teamName} players={team.players} />
      ))}
    </div>
  );
}
