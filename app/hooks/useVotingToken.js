'use client'

import { useEffect, useState } from "react"
import { fetchVotingRightsWithKey, fetchVotingTokenWithKey, postVote } from "@/app/lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"

const useVotingToken = ({organiser,sessionId}) => {
    const [value,setValue] = useState(null)
    const [requestKey,setRequestKey] = useState(false)
    
    const save = (t) => {
        setValue(t)
        localStorage.setItem("vote4it"+sessionId,t)
    }

    const submitKey = async ({key}) => {
        const newVotingToken = await tryAndCatch(fetchVotingTokenWithKey,{organiser,sessionId,key})
        if(newVotingToken)
            save(newVotingToken)
    }
    
    const checkVotingRights = async () => {
        const responseBody = await tryAndCatch(fetchVotingRightsWithKey,{organiser,sessionId})
        if(responseBody?.protected)
            setRequestKey(true)
        else if(responseBody?.token)
            save(responseBody.token)
    }

    const submitVote = async (id) => {
        const newVotingToken = await tryAndCatch(postVote,{organiser,sessionId,token:value,id})
        if(newVotingToken)
            save(newVotingToken)
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("vote4it"+sessionId)
        if(storedToken)
            setValue(storedToken)
        else
            checkVotingRights()
    },[])

    useEffect(() => {
        if(value) 
            setRequestKey(false)
    },[value])

    return {votingToken:value,requestKey,submitKey,submitVote}
}

export default useVotingToken