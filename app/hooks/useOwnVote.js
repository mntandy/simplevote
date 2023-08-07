'use client'

import { useState, useEffect } from "react"

const useOwnVote = ({votingToken,sessionApi}) => {
    const [value,set] = useState(null)

    const get = async () => {
        const responseBody = await sessionApi.post({
            url: "/token", 
            requestBody:{votingToken},
            expectedProperties:["previousVote"]
        })
        if(responseBody)
            set(responseBody.previousVote)
    }

    useEffect(() => {
        if(votingToken)
        get()
    },[votingToken])

    return value
}

export default useOwnVote