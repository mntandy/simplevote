
import { useEffect, useState } from "react"

const useInterval = () => {

    const [id,setId] = useState(null)

    useEffect(() => {
        return clear
    },[])

    const clear = () => {
        if(id) {
            clearInterval(id)
            setId(null)
        }
    }
    const set = (f,interval) => {
        if(id)
            clearInterval(id)
        setId(setInterval(f,interval))
    }

    return {clear,set}
}

export default useInterval

