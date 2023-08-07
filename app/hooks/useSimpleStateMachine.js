import { useState } from "react"

const useSimpleStateMachine = (states,initial) => {
    const [current, setCurrent] = useState(initial)
    const set = (next) => {
        if(states.includes(next))
            setCurrent(next)
    }
    const reset = () => setCurrent(initial)
    return {set,reset,current}
}

export default useSimpleStateMachine