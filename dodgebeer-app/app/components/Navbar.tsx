"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
      <div className="container">
        <Link className="navbar-brand mx-auto fw-bold fs-3" href="/">
          🍺 🏆 Dodge Beer
        </Link>

        {/* toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/*  nav items */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="mainNavbar"
        >
          <ul className="navbar-nav gap-4">
            <li className="nav-item">
              <Link className="nav-link fs-5" href="/">
                Create Team
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" href="/">
                New Game
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" href="/">
                Stats
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
