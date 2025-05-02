"use client";
// next + react
import { useState } from "react";
import Link from "next/link";
// icons
import { RxDoubleArrowLeft } from "react-icons/rx";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiTeamLine } from "react-icons/ri";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoBeerOutline } from "react-icons/io5";
// css
import styles from "@/app/components/ui/Sidebar/Sidebar.module.css";

export default function Sidebar() {
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const toggleSideBar = () => {
    setIsClosed((prev) => !prev);
  };

  return (
    <div id={styles.sidebar} className={`${isClosed ? styles.close : ""}`}>
      <ul>
        <li>
          <span className={styles.logo}>DodgeBeer</span>
          <button id={styles["toggle-btn"]} onClick={toggleSideBar}>
            <RxDoubleArrowLeft
              className={`${styles["arrow-icon"]} ${isClosed ? styles.rotate : ""}`}
            />
          </button>
        </li>
        <li className={styles.active}>
          <Link href="/">
            <AiOutlineDashboard className={styles["sidebar-icon-item"]} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/teams">
            <RiTeamLine className={styles["sidebar-icon-item"]} />
            <span>Teams</span>
          </Link>
        </li>
        <li>
          <Link href="/players">
            <IoPersonCircleOutline className={styles["sidebar-icon-item"]} />
            <span>Players</span>
          </Link>
        </li>
        <li>
          <Link href="/games">
            <IoBeerOutline className={styles["sidebar-icon-item"]} />
            <span>Games</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
