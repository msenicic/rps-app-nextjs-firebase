"use client"

import { useContext } from "react";
import Context from "@/context/Context";

function Footer() {
  const { setActive } = useContext(Context);

  return (
    <footer>
      <div className="button" onClick={()=>{setActive(true)}}>
        Rules
      </div>
    </footer>
  )
}

export default Footer