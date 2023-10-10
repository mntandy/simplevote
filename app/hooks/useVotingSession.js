'use client'

import { useState, useEffect } from "react"

import useInterval from '@/app/hooks/useInterval'
import useVotingToken from '@/app/hooks/useVotingToken'
import useCountdown from "./useCountdown"
import useToggleState from "./useToggleState"
import { fetchVotingSession, postVote } from "../lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"
import { containsArray } from "../lib/basicutils"

const arrToMap = (arr) => arr.reduce((acc, e) => acc.set(e, 1 + (acc.get(e) || 0)), new Map())

const useOptions = () => {
    const [options, set] = useState([])

    const sorted = () => options.toSorted((a, b) => a.votes < b.votes ? 1 : (a.votes > b.votes ? -1 : 0))
    const unSorted = () => options

    return { set, sorted, unSorted }
}

const useVotingSession = ({ sessionId, organiser }) => {
    const autoRefresh = useToggleState(false)
    const [description, setDescription] = useState("")
    const [info, setInfo] = useState({})
    const [currentVotes, setCurrentVotes] = useState(new Map())
    const refreshTimer = useInterval()
    const [maxVotes, setMaxVotes] = useState(null)
    const [myVotes, setMyVotes] = useState(null)
    const { votingToken, requestKey, submitKey, saveToken } = useVotingToken({ sessionId, organiser })
    const { timeleft, initialiseCountdown } = useCountdown({ organiser })
    const options = useOptions()
    const resetInfo = () => setInfo({})


    const fetchData = async () => {
        const responseBody = await tryAndCatch(fetchVotingSession, { organiser, sessionId, token: votingToken })
        if (responseBody) {
            setDescription(responseBody.description)
            options.set(responseBody.options)
            if (responseBody?.maxVotes)
                setMaxVotes(responseBody.maxVotes)
            if (containsArray(responseBody, "currentVotes")) {
                setMyVotes(responseBody.currentVotes.length)
                setCurrentVotes(arrToMap(responseBody.currentVotes))
            }
            if (responseBody?.expiration)
                initialiseCountdown(responseBody.expiration)
        }
    }

    const resetFetchTimer = () => {
        refreshTimer.clear()
        refreshTimer.set(fetchData, 3000)
    }

    const submitVote = async (id, value) => {
        console.log(value)
        const result = await tryAndCatch(postVote, { organiser, sessionId, token: votingToken, upvote:value, id })
        if (result?.token)
            saveToken(result.token)
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

    useEffect(() => {
        if (autoRefresh.state)
            resetFetchTimer()
        else
            refreshTimer.clear()
    }, [autoRefresh.state])

    useEffect(() => {
        if (votingToken) {
            fetchData()
            if (autoRefresh.state)
                resetFetchTimer()
        }
    }, [votingToken])

    return {
        timeleft,
        maxVotes,
        myVotes,
        resetInfo,
        info,
        currentVotes,
        options,
        description,
        submitVote,
        submitKey,
        requestKey,
        autoRefresh
    }
}

export default useVotingSession