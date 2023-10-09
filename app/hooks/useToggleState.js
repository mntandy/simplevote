import { useState } from "react"

const useToggleState = (initial) => {
    const [state, setState] = useState(initial)
    const toggle = () => setState(!state)
    return {state, toggle}
}

export default useToggleState