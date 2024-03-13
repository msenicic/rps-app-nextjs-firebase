"use client"

import Link from "next/link"
import { useContext } from "react"
import Context from "@/context/Context"

function Header() {
  const { player } = useContext(Context);

  return (
    <header>
      <div className="logo">
        <Link href="/">
          <img src="/logo.svg" alt="Logo"/>
        </Link>
      </div>
      <div className="score">
        <p>Sp/Mp</p>
        <span>{player.singleplayer}/{player.multiplayer}</span>
      </div>
    </header>
  )
}

export default Header