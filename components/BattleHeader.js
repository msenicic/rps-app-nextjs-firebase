"use client"

import { useContext } from "react"
import Context from "@/context/Context"

function BattleHeader() {
  const { game } = useContext(Context);

    return (
        <header>
        <div className="score">
            <p>{game.player.name}</p>
            <span>{game.player.score}</span>
        </div>
        <div className="score">
            <p>Round</p>
            <span>{game.round}</span>
        </div>
        <div className="score">
            <p>{game.enemy.name}</p>
            <span>{game.enemy.score}</span>
        </div>
        </header>
    )
}

export default BattleHeader