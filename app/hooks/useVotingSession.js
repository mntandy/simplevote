'use client'

import { useState, useEffect } from "react"

import useInterval from '@/app/hooks/useInterval'
import useVotingToken from '@/app/hooks/useVotingToken'
import { fetchVotingSession } from "../lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"
import { containsArray } from "../lib/basicutils"

const arrToMap = (arr) => arr.reduce((acc, e) => acc.set(e, 1 + (acc.get(e) || 0)), new Map())

const useVotingSession = ({ sessionId, organiser, autoRefresh }) => {
    const [description, setDescription] = useState("")
    const [options, setOptions] = useState([])
    const [info, setInfo] = useState({})
    const [currentVotes, setCurrentVotes] = useState(new Map())
    const refreshTimer = useInterval()
    const [expiration, setExpiration] = useState(null)
    const [maxVotes, setMaxVotes] = useState(null)
    const [myVotes, setMyVotes] = useState(null)
    const [voteSubmitted, setVoteSubmitted] = useState(false)
    const { votingToken, requestKey, submitKey, submitVote } = useVotingToken({ sessionId, organiser })
    const resetInfo = () => setInfo({})

    const sortedOptions = () => options.toSorted((a, b) => a.votes < b.votes ? 1 : (a.votes > b.votes ? -1 : 0))

    const fetchData = async () => {
        const responseBody = await tryAndCatch(fetchVotingSession, { organiser, sessionId, token: votingToken })
        if (responseBody) {
            setDescription(responseBody.description)
            setOptions(responseBody.options)
            if (responseBody?.maxVotes)
                setMaxVotes(responseBody.maxVotes)
            if (containsArray(responseBody,"currentVotes")) {
                setMyVotes(responseBody.currentVotes.length)
                setCurrentVotes(arrToMap(responseBody.currentVotes))
            }
            if (responseBody?.expiration)
                setExpiration(responseBody.expiration)
        }
    }

    const resetFetchTimer = () => {
        refreshTimer.clear()
        refreshTimer.set(fetchData, 3000)
    }

    const handleVote = (id, value) => async () => {
        if (voteSubmitted) {
            setInfo({ ...info, [id]: "registerFirst" })
        }
        else {
            setVoteSubmitted(true)
            const result = await submitVote(id, value)
            if (result?.info) {
                if (id in info)
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
        setVoteSubmitted(false)
    }

    useEffect(() => {
        if (autoRefresh)
            resetFetchTimer()
        else
            refreshTimer.clear()
    }, [autoRefresh])

    useEffect(() => {
        if (votingToken) {
            fetchData()
            if (autoRefresh)
                resetFetchTimer()
        }
    }, [votingToken])

    return { maxVotes, myVotes, resetInfo, info, currentVotes, options, sortedOptions, description, handleVote, submitKey, requestKey, expiration }
}

export default useVotingSession