'use client'

import { useState, useEffect } from "react"

import useInterval from '@/app/hooks/useInterval'
import useVotingToken from '@/app/hooks/useVotingToken'
import { fetchVotingSession } from "../lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"

const arrToMap = (arr) => arr.reduce((acc, e) => acc.set(e, 1 + (acc.get(e) || 0)), new Map())

const useVotingSession = ({sessionId,organiser,autoRefresh}) => {
    const [description,setDescription] = useState("")
    const [options,setOptions] = useState([])
    const [info,setInfo] = useState({})
    const [currentVotes,setCurrentVotes] = useState(new Map())
    const refreshTimer = useInterval()
    const [expiration,setExpiration] = useState(null)
    const {votingToken,requestKey,submitKey,submitVote} = useVotingToken({sessionId,organiser})
    const resetInfo = () => setInfo({})
    
    const sortedOptions = () => options.toSorted((a, b) => a.votes < b.votes ? 1 : (a.votes > b.votes ? -1 : 0))

    const fetchData = async () => {
        const responseBody = await tryAndCatch(fetchVotingSession,{organiser,sessionId,token:votingToken})
        if(responseBody) {
            setDescription(responseBody.description)
            setOptions(responseBody.options)
            if(responseBody?.currentVotes)
                setCurrentVotes(arrToMap(responseBody.currentVotes))
            if(responseBody?.expiration)
                setExpiration(responseBody.expiration)
        }
    }

    const resetFetchTimer = () => {
        refreshTimer.clear()
        refreshTimer.set(fetchData,3000)
    }

    const handleVote = (id,value) => async () => {
        const result = await submitVote(id,value)
        if(result?.info) {
            if(id in info)
                resetInfo()
            else {
                const temp = {}
                temp[id] = result.info
                setInfo(temp)
            }
        }
        else
            resetInfo()
    }

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

    return {resetInfo,info,currentVotes,options,sortedOptions,description,handleVote,submitKey,requestKey,expiration}
}

export default useVotingSession