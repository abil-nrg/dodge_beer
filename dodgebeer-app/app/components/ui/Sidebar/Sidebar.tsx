"use client";

// next + react
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const currentPath = usePathname();

  const iconStyles = styles["sidebar-icon-item"];
  const sidebarItems = [
    {
      pathname: "/",
      icon: <AiOutlineDashboard className={iconStyles} />,
      text: "Dashboard",
    },
    {
      pathname: "/teams",
      icon: <RiTeamLine className={iconStyles} />,
      text: "Teams",
    },
    {
      pathname: "/players",
      icon: <IoPersonCircleOutline className={iconStyles} />,
      text: "Players",
    },
    {
      pathname: "/games",
      icon: <IoBeerOutline className={iconStyles} />,
      text: "Games",
    },
  ];

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

        {sidebarItems.map((path) => {
          const isActivePage = currentPath === path.pathname;

          return (
            <li
              key={path.pathname}
              className={`${isActivePage ? styles.active : ""}`}
            >
              <Link href={path.pathname}>
                {path.icon}
                <span>{path.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
