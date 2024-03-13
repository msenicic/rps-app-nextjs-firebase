"use client"

import Roles from "@/components/Roles"
import Battle from "@/components/Battle"
import Loader from "./Loader"
import { useContext, useEffect, useState } from "react"
import Context from "@/context/Context"

import { auth, db } from "@/firebase"
import { ref, onValue, get, update } from "firebase/database"

export default function Game({roomId}) {
  const { game, setGame } = useContext(Context);
  const [loader, setLoader] = useState(false)
  const playerId = auth.currentUser.uid;

  async function findEnemyPlayer(roomId, playerId) {
    const playerSnapshot = await get(ref(db, `rooms/${roomId}/players`));
    const players = playerSnapshot.val();
  
    // Find the enemy player excluding the current player
    return Object.keys(players).find(key => key !== playerId);
  }

  async function waitingForPlayer() {
    const enemyId = await findEnemyPlayer(roomId, playerId)
    onValue(ref(db, `rooms/${roomId}/players/${playerId}/role`), async (snapshot)=> {
      const enemy = await get(ref(db, `rooms/${roomId}/players/${enemyId}/role`));
      const round = await get(ref(db, `rooms/${roomId}/round`));
      if(snapshot.val() == "waiting" ) {
        setLoader(true)
      } else {
        setLoader(false)
      }
  
      if(snapshot.val() == "waiting" && enemy.val() == "waiting" ) {
        await update(ref(db, `rooms/${roomId}`), {
          round: round.val() + 1
        });
        await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
          role: "nothing"
        });
        await update(ref(db, `rooms/${roomId}/players/${enemyId}`), {
          role: "nothing"
        });
      }
    })

    onValue(ref(db, `rooms/${roomId}/round`), async (snapshot)=> {
      if(snapshot.val() != 1) {
        setLoader(false);
        setGame(prev=> ({
          ...prev, round: prev.round + 1
        }))
      }
    })
  }

  useEffect(()=>{
    const setNames = async ()=> {
      const enemyId = await findEnemyPlayer(roomId, playerId);
      const enemy = await get(ref(db, `rooms/${roomId}/players/${enemyId}`));
      const player = await get(ref(db, `rooms/${roomId}/players/${playerId}`));
      setGame(prev => ({
          ...prev, player: {
              ...prev.player, name: player.val().name
          }, enemy: {
              ...prev.enemy, name: enemy.val().name
          }
      }))
    }
    setNames();
    waitingForPlayer();
  },[])
  
  return (
    loader ? <Loader /> :
    game.player.role == null ? <Roles roomId={roomId}/> : <Battle roomId={roomId}/>
  )
}