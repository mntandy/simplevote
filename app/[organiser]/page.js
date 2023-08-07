'use client'
import Sessions from "@/app/components/Sessions"
import { useEffect } from "react"
import useSessions from "@/app/hooks/useSessions"
import useSimpleStateMachine from '@/app/hooks/useSimpleStateMachine'

const Page = ({ params }) => {
    const sessions = useSessions({organiser:params.organiser})

    const states = {
        LOADING: "loading",
        READY:"ready",
    }
    const stateComponents = {
        "loading": <p>Loading...</p>,
        "ready": <Sessions sessions={sessions} organiser={params.organiser}/>,
    }

    const state = useSimpleStateMachine(Object.values(states),states.LOADING)
    
    useEffect(() => {
        if(sessions.isLoading)
            state.set(states.LOADING)
        else
            state.set(states.READY)
    },[sessions.isLoading])

    return (<>{sateComponents[state.current]}</>)
}

export default Page