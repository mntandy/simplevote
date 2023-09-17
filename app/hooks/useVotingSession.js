'use client'

import { useState, useEffect } from "react"

import useInterval from '@/app/hooks/useInterval'
import useVotingToken from '@/app/hooks/useVotingToken'
import { fetchVotingSession } from "../lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"

const useVotingSession = ({sessionId,organiser,autoRefresh}) => {
    const [description,setDescription] = useState("")
    const [options,setOptions] = useState([])
    const [info,setInfo] = useState({})
    const [previousVote,setPreviousVote] = useState(null)
    const refreshTimer = useInterval()
    const [expiration,setExpiration] = useState(null)
    const {votingToken,requestKey,submitKey,submitVote} = useVotingToken({sessionId,organiser})
    const resetInfo = () => setInfo({})
        
    const fetchData = async () => {
        const responseBody = await tryAndCatch(fetchVotingSession,{organiser,sessionId,token:votingToken})
        if(responseBody) {
            setDescription(responseBody.description)
            setOptions(responseBody.options)
            if(responseBody?.previousVote)
                setPreviousVote(responseBody.previousVote)
            if(responseBody?.expiration)
                setExpiration(responseBody.expiration)
        }
    }

    const resetFetchTimer = () => {
        refreshTimer.clear()
        refreshTimer.set(fetchData,3000)
    }

    const handleVote = (id) => async () => {
        const result = await submitVote(id)
        if(result?.info) {
            if(id in info)
                resetInfo()
            else {
                const temp = {}
                temp[id] = result.info
                setInfo(temp)
            }
        }
    }

    useEffect(() => {
        console.log(info)
    },[info])

    useEffect(() => {
        if(autoRefresh)
                resetFetchTimer()
            else
                refreshTimer.clear()
        },[autoRefresh])

    useEffect(() => {
        if(votingToken) {
            fetchData()
            if(autoRefresh)
                resetFetchTimer()
        }
    },[votingToken])

    return {resetInfo,info,previousVote,options,description,handleVote,submitKey,requestKey,expiration}
}

export default useVotingSession