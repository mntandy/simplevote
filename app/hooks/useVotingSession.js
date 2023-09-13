'use client'

import { useState, useEffect } from "react"

import useCountdown from '@/app/hooks/useCountdown'
import useInterval from '@/app/hooks/useInterval'
import useVotingToken from '@/app/hooks/useVotingToken'
import { fetchVotingSession } from "../lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"

const useVotingSession = ({sessionId,organiser,autoRefresh}) => {
    const [description,setDescription] = useState("")
    const [options,setOptions] = useState([])
    const [previousVote,setPreviousVote] = useState(null)
    const refreshTimer = useInterval()
    const {votingToken,requestKey,submitKey,submitVote} = useVotingToken({sessionId,organiser})
    const {timeleft, expired, initialiseCountdown} = useCountdown()
    
    const fetchInfo = async () => {
        const responseBody = await tryAndCatch(fetchVotingSession,{organiser,sessionId,token:votingToken})
        if(responseBody) {
            setDescription(responseBody.description)
            setOptions(responseBody.options)
            setPreviousVote(responseBody?.previousVote ?? null)
            if (!timeleft && !expired && responseBody?.expiration)
                initialiseCountdown(new Date(responseBody.expiration))
        }
    }

    const handleVote = (id) => async () => submitVote(id)

    useEffect(() => {
        if(autoRefresh)
                refreshTimer.set(fetchInfo,3000)
            else
                refreshTimer.clear()
        },[autoRefresh])

    useEffect(() => {
        if(votingToken) {
            fetchInfo()
        }
    },[votingToken])

    return {previousVote,options,description,timeleft,handleVote,submitKey,requestKey}
}

export default useVotingSession