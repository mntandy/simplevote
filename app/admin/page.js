'use client'

import { useEffect } from 'react'
import Login from "@/app/components/Login"
import CreateNewVote from "@/app/components/CreateNewVote"
import SessionsAsAdmin from "@/app/components/SessionsAsAdmin"

import useSessions from '@/app/hooks/useSessions'
import useSimpleStateMachine from '@/app/hooks/useSimpleStateMachine'

const Switch = ({sessions}) => {
    
    const states = {
        SESSIONS: "sessions",
        CREATENEW:"createnew",
    }

    const {current,set,reset} = useSimpleStateMachine(Object.values(states),states.SESSIONS)

    const stateComponents = {
        "sessions": <SessionsAsAdmin sessions={sessions} handleCreateNew={() => set("createnew")}/>,
        "createnew": <CreateNewVote sessions={sessions} close={reset}/>,
    }
    return (<>{stateComponents[current]}</>)
}

const Page = () => {
    const sessions = useSessions({loginRequired:true})

    const states = {
        LOADING: "loading",
        READY:"ready",
        LOGIN:"login",
    }

    const stateComponents = {
        "loading": <p>Loading...</p>,
        "ready": <Switch sessions={sessions}/>,
        "login": <Login/>
    }

    const state = useSimpleStateMachine(Object.values(states),states.LOGIN)
    
    useEffect(() => {
        if(sessions.isLoggedIn && sessions.isLoading)
            state.set(states.LOADING)
        else if(sessions.isLoggedIn && !sessions.isLoading)
            state.set(states.READY)
        else
            state.set(states.LOGIN)
    },[sessions.isLoading,sessions.isLoggedIn])


    return (
        <>
            {stateComponents[state.current]}
        </>)
}

export default Page