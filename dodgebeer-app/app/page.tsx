export default function Home() {
  const cur_year = new Date().getFullYear();

  return (
    <div className="welcome-text">
      Welcome to Dodge Beer {cur_year} Tournament !
    </div>
  );
}
