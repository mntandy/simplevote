'use client'

export default function Message({msg}) {

    if(msg.text) return (
        <div className={"notification " + msg.style}>
            <button className="delete" onClick={(event) => msg.reset()}></button>
            {msg.text}
        </div>
        )
    return null
}
