"use client"

import { useContext, useEffect } from "react"
import Context from "@/context/Context"

import { auth, db } from "@/firebase"
import { ref, update, onValue, get } from "firebase/database"

function Role({item, roomId}) {
  const { game, setGame, setShowEnemyRole } = useContext(Context);
  const playerId = auth.currentUser.uid;

  async function pickRole(role) {
    await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
      role
    });
    setGame(prev=> ({
      ...prev, player: {
          ...prev.player, role: role
      }
    }))

    const enemyId = await findEnemyPlayer(roomId, playerId)
    const enemy = await get(ref(db, `rooms/${roomId}/players/${enemyId}`));
    if(enemy.val().role == "nothing") {
      onValue(ref(db, `rooms/${roomId}/players/${enemyId}`), (snapshot)=> {
        const enemyData = snapshot.val()
        if(enemyData) {
          if(enemyData.role != "nothing" && enemyData.role != "waiting") {
            setGame(prev=> ({
              ...prev, enemy: {
                  ...prev.enemy, role: enemyData.role
              }
            }))
            setTimeout(() => {
              setShowEnemyRole(true);
            }, 500);
          }
        }
      })
    } else {
      setGame(prev=> ({
        ...prev, enemy: {
            ...prev.enemy, role: enemy.val().role
        }
      }))
      setTimeout(() => {
        setShowEnemyRole(true);
      }, 500);
    }
    
  }

  async function findEnemyPlayer(roomId, playerId) {
    const playerSnapshot = await get(ref(db, `rooms/${roomId}/players`));
    const players = playerSnapshot.val();
  
    // Find the enemy player excluding the current player
    return Object.keys(players).find(key => key !== playerId);
  }

  return (
    <div className={`circle ${item.role} animation ${game.winner == item && game.player.role != null && "winner"}`} onClick={()=>pickRole(item.role)}>
        <div className="inner">
            <img src={`/icon-${item.role}.svg`} alt={item.role} />
        </div>
    </div>
  )
}

export default Role