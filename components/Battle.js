"use client"

import { useContext, useEffect, useState } from "react"
import Context from "@/context/Context"

import { auth, db } from "@/firebase"
import { ref, update, get, onValue, set } from "firebase/database"

import { useRouter } from "next/navigation";

function Battle({roomId}) {
    const { game, setGame, setPlayer, showEnemyRole, setShowEnemyRole } = useContext(Context);
    const [popUp, setPopUp] = useState("");
    const playerId = auth.currentUser.uid;
    const router = useRouter();

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //       const enemyIndex = Math.floor(Math.random() * DATA.length);
    //       setEnemyRole(DATA[enemyIndex]);

    //       setTimeout(() => {
    //         setShowEnemyRole(true);
    //       }, 500);
    //     }, 1000);
      
    //     return () => {
    //         clearTimeout(timeoutId);
    //     }
    // }, []);
    useEffect(()=>{
        if(game.enemy.role != null && game.player.role != null)
            checkWin(game.player.role, game.enemy.role);
    },[game.enemy.role, game.player.role])

    const checkWinner = async ()=>{
        const enemyId = await findEnemyPlayer(roomId, playerId);
        onValue(ref(db, `rooms/${roomId}/players/${playerId}/score`), async (snapshot) => {
            if(snapshot.val() == 3) {
                setPopUp("win")
            } 
        });
        onValue(ref(db, `rooms/${roomId}/players/${enemyId}/score`), async (snapshot) => {
            if(snapshot.val() == 3) {
                setPopUp("lose")
            }
        });
    }

    const reset = async ()=> {
        if(popUp == "win") {
            const wins = await get(ref(db, `players/${playerId}/wins`))
            await update(ref(db, `players/${playerId}`), {
                wins: wins.val() + 1
            });
            setPlayer(prev => ({
                ...prev, multiplayer: prev.multiplayer + 1
            }))
        }
        await set(ref(db, `players/${playerId}/roomId`), null);
        await set(ref(db, `rooms/${roomId}/players/${playerId}`), null);
        setGame(prev=> ({
            ...prev, player: {
                ...prev.player, role: null
            }, enemy: {
                ...prev.enemy, role: null
            }, winner: null, round: 1
        }))
        setShowEnemyRole(false);
        setPopUp('')
        router.push('/');
    }

    const checkWin = async (role, enemyRole)=>{
        const rules = {
            rock: { beats: "scissors" },
            paper: { beats: "rock" },
            scissors: { beats: "paper" }
          };
        
          const pWins = await get(ref(db, `rooms/${roomId}/players/${playerId}/score`)); 

        if (rules[role].beats == enemyRole) {
            setGame(prev=> ({
                ...prev, player: {
                    ...prev.player, score: prev.player.score + 1
                }, enemy: {
                    ...prev.enemy, score: prev.enemy.score - 1
                }, winner: role
            }))
            await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
                score: pWins.val() + 1
            });
        } else if (rules[enemyRole].beats == role){
            setGame(prev=> ({
                ...prev, player: {
                    ...prev.player, score: prev.player.score - 1
                }, enemy: {
                    ...prev.enemy, score: prev.enemy.score + 1
                }, winner: enemyRole
            }))
            await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
                score: pWins.val() - 1
            });
        } else {
            setGame(prev=> ({
                ...prev, winner: "draw"
            }))
        }

        checkWinner();
    }

    const restart = async ()=> {
        setGame(prev=> ({
            ...prev, player: {
                ...prev.player, role: null
            }, enemy: {
                ...prev.enemy, role: null
            }, winner: null
        }))
        setShowEnemyRole(false);
        await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
            role: "waiting"
        });
    }

    async function findEnemyPlayer(roomId, playerId) {
        const playerSnapshot = await get(ref(db, `rooms/${roomId}/players`));
        const players = playerSnapshot.val();
      
        // Find the enemy player excluding the current player
        return Object.keys(players).find(key => key !== playerId);
    }

  return (
    <div className="battle">
        <div className={`circle ${game.player.role} animation ${game.winner == game.player.role && game.player.role != null && "winner"} me`}>
            <div className="inner">
                <img src={`/icon-${game.player.role}.svg`} alt={game.player.role} />
            </div>
        </div>
        {showEnemyRole == false ? 
            <div className={`circle empty ${game.enemy.role != null && "animation"}`}>
                <div className="inner"></div>
            </div> :
            <div className={`circle ${game.enemy.role} animation ${game.winner == game.enemy.role && game.enemy.role != null && "winner"} enemy`}>
                <div className="inner">
                    <img src={`/icon-${game.enemy.role}.svg`} alt={game.enemy.role} />
                </div>
            </div>
        }
        <div className="wrap">
            <p className="animation">{game.player.name} Picked</p>
            <p className="animation">{game.enemy.name} picked</p>
        </div>
        {game.winner != null &&
            <div className='result animation'>
                {popUp ? (
                    <p>{`Game End(${popUp})`}</p>
                ) : game.winner == game.player.role ? (
                    <p>You Win</p>
                ) : game.winner == game.enemy.role ? (
                    <p>You Lose</p>
                ) : (
                    <p>Draw</p>
                )}
                {popUp ? (
                    <div className="button" onClick={reset}>
                        Exit
                    </div>
                ) : (
                    <div className="button" onClick={restart}>
                        Play Again
                    </div>
                )}
            </div>
        }
    </div>
  )
}

export default Battle