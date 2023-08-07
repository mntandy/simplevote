'use client'

import { useState, useEffect } from "react"

import useCountdown from '@/app/hooks/useCountdown'
import useInterval from '@/app/hooks/useInterval'
import useVotingToken from '@/app/hooks/useVotingToken'

const useVotingSession = ({sessionId,sessionApi,autoRefresh}) => {
    const [description,setDescription] = useState("")
    const [options,setOptions] = useState([])
    const refreshTimer = useInterval()
    const {ownVote,votingToken,requestKey,submitKey,submitVote} = useVotingToken({sessionId,sessionApi})
    const {timeleft, expired, initialiseCountdown} = useCountdown()
    
    const fetchInfo = async () => {
        const responseBody = await sessionApi.get({
            token:votingToken,
            expectedProperties:["description","options"]
        })
        if (responseBody?.description)
            setDescription(responseBody.description)
        if (responseBody?.options)
            setOptions(responseBody.options)
        if (!timeleft && !expired && responseBody?.expiration)
            initialiseCountdown(new Date(responseBody.expiration))
    }

    const handleVote = (id) => () => submitVote(id)

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

    return {ownVote,options,description,timeleft,handleVote,submitKey,requestKey}
}

export default useVotingSession