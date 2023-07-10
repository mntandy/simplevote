'use client'

import { useEffect, useState } from "react"

export default ({organiser,setError}) => {
    const [ongoing,setOngoing] = useState([])
    const [expired,setExpired] = useState([])
    const [isLoading, setLoading] = useState(false)

    const fetchSessions = async () => {
        try {
            const response = await fetch(`/api/vote/${organiser}`)
            const body = await response.json()
            if(body.nickname===organiser && Array.isArray(body.ongoing) && Array.isArray(body.expired)) {
                setOngoing(body.ongoing)
                setExpired(body.expired)
            }
                
            else
                (setError instanceof Function && setError("Received weird data from the server."))
        }
        catch (err) {
            (setError instanceof Function && setError("Something bad happened when fetching list of voting sessions"))
        }
        setLoading(false)
    }
        
    useEffect(() => {
        setLoading(true)
        fetchSessions()
    }, [])

    const refetch = () => fetchSessions()

    return {ongoing,expired,isLoading,refetch}
}
