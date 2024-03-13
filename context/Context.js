"use client";

import { createContext, useState, useEffect } from "react";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [vh, setVh] = useState(null);
    const [active, setActive] = useState(false);
    const [showEnemyRole, setShowEnemyRole] = useState(false);
    const [game, setGame] = useState({
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

    const [player, setPlayer] = useState({
        name: '',
        singleplayer: 0,
        multiplayer: 0
    });

    useEffect(() => {
        const setActualVh = () => {
            const actualVh = window.innerHeight * 0.01;
            setVh(actualVh);
            document.documentElement.style.setProperty('--vh', `${actualVh}px`);
        }

        setActualVh();
        window.addEventListener('resize', setActualVh);

        return () => {
            window.removeEventListener('resize', setActualVh);
        };
    }, []);

    useEffect(()=>{
        active ? document.body.classList.add('overflow') : document.body.classList.remove('overflow');
    },[active])

    const value = {
        active, 
        setActive,
        game,
        setGame,
        player,
        setPlayer, 
        showEnemyRole, 
        setShowEnemyRole,
    }

    return(
        <Context.Provider value={value}>{children}</Context.Provider>
    )
}

export default Context;