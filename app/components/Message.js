'use client'

import { useContext } from 'react'
import { MessageContext } from "@/app/contexts"

const Message = () => {
    const msg = useContext(MessageContext)
    if(msg.text) return (
        <div className="centered">
        <div className="container message">
            <div className="message-text">{msg.text}</div>
            <button className="close-button" onClick={(event) => msg.reset()}><div className="close-div"/></button>
        </div>
        </div>
        )
    return null
}

export default Message 