
import { useEffect, useState } from "react"

const useInterval = () => {

    const [id,setId] = useState(null)

    const clear = () => {
        if(id) {
            clearInterval(id)
            setId(null)
        }
    }

    useEffect(() => {
        return clear
    },[])
    
    const set = (f,interval) => {
        if(id)
            clearInterval(id)
        setId(setInterval(f,interval))
    }

    return {clear,set}
}

export default useInterval

