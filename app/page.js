"use client"

import Footer from '@/components/Footer'
import Header from '@/components/Header'

import Link from "next/link"
import { useContext, useEffect } from "react"
import Context from "@/context/Context"

import { auth, db } from "@/firebase"
import { ref, get, set } from "firebase/database"

export default function Home() {
  const { player, setPlayer, setGame, setShowEnemyRole } = useContext(Context);

  const handleChange = (e) => {
      const { name, value } = e.target
      setPlayer(prev => {
          return (
              { ...prev, [name]: value }
          )
      })
  }

  useEffect(()=>{
    const playerId = auth.currentUser?.uid;

    const refresh = async () => {
      if(playerId) {
        const roomId = await get(ref(db, `players/${playerId}/roomId`));
        if(roomId) {
          await set(ref(db, `rooms/${roomId.val()}/players/${playerId}`), null);
          await set(ref(db, `players/${playerId}/${roomId.val()}`), null);
        }
      }  
    }

    refresh();
  },[])

  const restart = () => {
    setGame({
      player: {
          name: '',
          role: null,
          score: 0
      },
      enemy: {
          name: '',
          role: null,
          score: 0
      },
      round: 1,
      winner: null
    })
    setShowEnemyRole(false);
  }

  return (
    <>
    <Header />
    <main>
      <input type="text" name="name" placeholder="Enter a name..." value={player.name} onChange={handleChange} />
      <div className='links'> 
        {/* <div className="link"> 
          <p>Singleplayer</p>
          <Link className="button" href="/singleplayer" onClick={restart}>
            Play Now!
          </Link>
        </div>  */}
        <div className="link"> 
          <p>Multiplayer</p>
          <Link className="button" href="/multiplayer" onClick={restart}>
            Play Now!
          </Link>
        </div> 
      </div>
    </main> 
    <Footer />
    </>
  )
}
