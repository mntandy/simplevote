'use client'

import { useState } from "react"

const useMessage = () => {
    const [text,setText] = useState(null)
    const [style,setStyle] = useState(null)

    const set = (s,t) => {
        setText(t)
        setStyle(s)
    }

    const setError = (str) => {
        set("is-danger",str)
    }

    const reset = () => {
        setText(null)
        setStyle(null)
    }
    return {text,style,reset,setError,set}
}

export default useMessage