"use client"

import { useEffect } from "react"

import { auth, db } from "@/firebase"
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { ref, update, query, push, orderByChild, get, onDisconnect, onChildRemoved, set, startAt, endAt, onValue  } from "firebase/database"

import { createName } from "@/data"
import { notFound, useRouter } from "next/navigation";
import Loader from "@/components/Loader"

import { useContext } from "react"
import Context from "@/context/Context"

export default function Multiplayer() {
  const { player } = useContext(Context);
  const router = useRouter();

  async function startGame() {
    await signInAnonymously(auth);
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentRoomSnapshot = await get(ref(db, `players/${user.uid}/roomId`));
        const currentRoomId = currentRoomSnapshot.val();

        if (currentRoomId) {
          // Player is already in a room, redirect them
          router.push(`/`);
        } else {
          await set(ref(db, `players/${user.uid}`), {
            name: player.name === '' ? createName() : player.name,
            wins: 0
          });

        // Set up onDisconnect listener to remove player data when the user disconnects
        onDisconnect(ref(db, `players/${user.uid}`)).remove();
        
          // Check for available room to join
          const availableRoom = await findAvailableRoom();
          let roomId;
          if (availableRoom) {
            // Join the available room
            roomId = availableRoom;
          } else {
            // Create a new room
            roomId = await createNewRoom();
            // Join the newly created room
          }
          joinRoom(user.uid, roomId);
          onValue(ref(db, `rooms/${roomId}`), async (snapshot)=> {
            const roomData = snapshot.val()
            if(roomData) {
              if(roomData.playerCount == 2 && roomData.round == 0) {
                await update(ref(db, `rooms/${roomId}`), {
                  round: 1
                });
                router.push(`/multiplayer/${roomId}`)
              }
              if(!roomData.players && roomData.round != 0) {
                await set(ref(db, `rooms/${roomId}`), null);
              }
              if(roomData.playerCount == 1) {
                onDisconnect(ref(db, `rooms/${roomId}`)).remove();
              }
            }
          })
          onDisconnect(ref(db, `rooms/${roomId}/players/${user.uid}`)).remove();
          // Navigate to multiplayer mode
          // Restart game context
          onChildRemoved(ref(db, `rooms/${roomId}/players`), async (snapshot)=>{
            if(snapshot.val().score != 3 && snapshot.val().score != -3) {
              router.push('/not-found');
            }
          })
        }
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }

  async function findAvailableRoom() {
    // Query the database to find an available room
    const roomsQuery = query(ref(db, 'rooms'), orderByChild('playerCount'), startAt(0), endAt(1));
    const roomsSnapshot = await get(roomsQuery);
    if (roomsSnapshot.exists()) {
      // Return the first available room found
      const rooms = roomsSnapshot.val();
      return Object.keys(rooms)[0];
    } else {
      // No available room found
      return null;
    }
  }

  async function createNewRoom() {
    // Create a new room in the database
    const newRoomRef = push(ref(db, 'rooms'));
    const newRoomId = newRoomRef.key;
    await set(ref(db, `rooms/${newRoomId}`), {
      id: newRoomId,
      playerCount: 0,
      round: 0
    });
    return newRoomId;
  }

  async function joinRoom(playerId, roomId) {
    const room = await get(ref(db, `rooms/${roomId}`));
    const playerName = await get(ref(db, `players/${playerId}`));
    // Add player to the room in the database
    await update(ref(db, `players/${playerId}`), { roomId });
    await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
      name: playerName.val().name,
      role: 'nothing',
      score: 0
    });
    await update(ref(db, `rooms/${roomId}`), {
      playerCount: room.val().playerCount == 0 ? 1 : 2
    });
  }

  useEffect(() => {
    startGame();
  }, []);

  
      
  return (
    <main className="custom">
      <h1>Waiting For Player</h1>
      <Loader />
    </main>
  )
}