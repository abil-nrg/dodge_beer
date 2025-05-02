"use client";
import Link from "next/link";
import { MdDoubleArrow } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiTeamLine } from "react-icons/ri";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoBeerOutline } from "react-icons/io5";
export default function Sidebar() {
  return (
    <div className={"navbar"}>
      <ul>
        <li>
          <span className="logo">DodgeBeer</span>
          <button id="toggle-btn">
            <MdDoubleArrow />
          </button>
        </li>
        <li className="active">
          <Link href="/">
            <AiOutlineDashboard />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/teams">
            <RiTeamLine />
            <span>Teams</span>
          </Link>
        </li>
        <li>
          <Link href="/players">
            <IoPersonCircleOutline />
            <span>Players</span>
          </Link>
        </li>
        <li>
          <Link href="/games">
            <IoBeerOutline />
            <span>Games</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
