"use client";
export default function Home() {
  const cur_year = new Date().getFullYear();

  return (
    <div className="welcome-text">
      Welcome to Dodge Beer {cur_year} Tournament !
      <button
        type="button"
        className="btn btn-success"
        onClick={() => {
          fetch("/api/temp")
            .then((response) => response.json())
            .then((data) => {
              console.log("Data from API:", data);
            });
        }}
      >
        Base class
      </button>
    </div>
  );
}
