
import { useEffect, useState } from "react"

const useInterval () => {

    const [repeat,setRepeat] = useState(null)

    useEffect(() => {
        return () => clear()
    },[])

    const clear = () => {
        if(repeat) {
            clearInterval(repeat)
            setRepeat(null)
        }
    }
    const set = (f,interval) => {
        if(repeat)
            clearInterval(repeat)
        setRepeat(setInterval(f,interval))
    }

    return {clear,set}
}

export default useInterval

