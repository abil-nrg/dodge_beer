export default function GamePage({ params }: { params: { game_id: string } }) {
  return <h1>Game ID: {params.game_id}</h1>;
}
