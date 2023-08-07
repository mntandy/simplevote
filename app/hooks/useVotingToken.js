'use client'

import { useEffect, useState, useContext } from "react"
import { UserContext } from '@/app/contexts'

import useOwnVote from '@/app/hooks/useOwnVote'

const useVotingToken = ({sessionId,sessionApi}) => {
    const [value,setValue] = useState(null)
    const [requestKey,setRequestKey] = useState(false)
    const ownVote = useOwnVote({votingToken:value,sessionApi})
    const user = useContext(UserContext)
    const save = (t) => {
        setValue(t)
        localStorage.setItem("vote4it"+sessionId,t)
    }

    const checkUserToken = async () => {
        const responseBody = await sessionApi.post({url:"/user",requestBody: {userToken:user.token}})
        if(responseBody?.token)
            save(responseBody.token)
    }

    const submitKey = async ({key}) => {
        const responseBody = await sessionApi.post({
            url:"/key",
            requestBody: {key},
            expectedProperties:["token"]
        })
        if(responseBody?.token)
            save(responseBody.token)
    }

    const checkVotingRights = async () => {
        const responseBody = await sessionApi.get({
            url:"/token",
            expectedProperties:[["protected","token"]]
        })
        if(responseBody?.protected) {
                setRequestKey(true)
                if(user.token)
                    checkUserToken()
        }
        else if(responseBody?.token)
            save(responseBody.token)
    }

    const submitVote = async (id) => {
        const responseBody = await sessionApi.post({
            token:value,requestBody:{ id },
            expectedProperties:[["token"]]
        })
        if(responseBody?.token)
            save(responseBody.token)
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("vote4it"+sessionId)
        if(storedToken)
            setValue(storedToken)
        else
            checkVotingRights()
    },[])

    useEffect(() => {
        if(!value && user.token)
            checkUserToken()
    },[user.token])

    useEffect(() => {
        if(value) 
            setRequestKey(false)
    },[value])

    return {votingToken:value,requestKey,submitKey,submitVote,ownVote}
}

export default useVotingToken