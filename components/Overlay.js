"use client"

import { useContext } from "react"
import Context from "@/context/Context"

function Overlay() {
  const { active, setActive } = useContext(Context);

  return (
    <div className={active ? 'overlay-backdrop active' : 'overlay-backdrop'}>
        <div className={active ? 'overlay active' : 'overlay'}>
            <p>Rules</p>
                <div className="rules">
                    <img src="/image-rules.svg" alt="Rules"/>
                </div>
                <div className="close" onClick={()=>{setActive(false)}}>
                    <img src="/icon-close.svg" alt="Icon Close"/>
                </div>
        </div>
    </div>
  )
}

export default Overlay