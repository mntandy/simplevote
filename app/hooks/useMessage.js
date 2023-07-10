'use client'

import { useState } from "react"

export default () => {
    const [text,setText] = useState(null)
    const [style,setStyle] = useState(null)

    const set = (s,t) => {
        setText(t)
        setStyle(s)
    }
    const reset = () => {
        setText(null)
        setStyle(null)
    }
    return {text,style,reset,set}
}
