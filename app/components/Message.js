'use client'

import { getClasses } from "../lib/styles"

export const reset = () => {
    const e = document.getElementById("msgDiv")
    if(e) 
        e.style.display="none"
    const m = document.getElementById("msgText")
    if(m)
        m.innerHTML=""
}

export const display = (txt) => {
    const e = document.getElementById("msgDiv")
    if(e)
        e.style.display=""
    const m = document.getElementById("msgText")
    if(m)
        m.innerHTML=txt
}

const Message = ({organiser}) => {
    return (
        <div className={getClasses(organiser,"container")} id="msgDiv" style={{display: "none"}}>
            <div className="message-text" id="msgText"></div>
            <button className="close-button" onClick={(event) => reset()}><div className="close-div"/></button>
        </div>
        )
}

export default Message 