'use client'
'use client'

import { useState, useContext, useEffect } from "react"
import useApi from "@/app/hooks/useApi"
import { UserContext } from '@/app/contexts'

const useSessions = ({organiser=null}) => {
    const user = useContext(UserContext)
    const sessionApi = useApi({path:"/vote"})
    const [isLoggedIn,setLoggedIn] = useState(false)
    const [isLoading,setLoading] = useState(false)
    const [{ongoing,expired},setSessions] = useState({ongoing:[],expired:[]})
    const reset = () => {
        setSessions({ongoing:[],expired:[]})
    }

    const get = async () => {
        setLoading(true)
        const responseBody = await sessionApi.get({
            url:`/${organiser ?? user.nickname}`,
            expectedProperties:["ongoingSessions","expiredSessions","nickname"],
            additionalTest: {
                func: (body) => (body.nickname===(organiser ?? user.nickname) && Array.isArray(body.ongoingSessions) && Array.isArray(body.expiredSessions)),
                error: "Bad data received from server."
            }
        })
        if(responseBody)
            setSessions({ongoing:responseBody.ongoingSessions,expired:responseBody.expiredSessions})
        setLoading(false)
    }

    const create = async ({session}) => {
        if(user.token) {
            const responseBody = await sessionApi.post({
                url: "/create",
                token: user.token,
                requestBody: session,
            })
            return responseBody
        }
        return null
    }

    const remove = async ({id}) => {
        if(user.token) {
            const responseBody = await sessionApi.del({
                url:`${user.nickname}/${id}`,
                token: user.token,
                })
            if(responseBody)
                get()
        }
    }

    useEffect(() => {
        if(!organiser) {
            if(user.token) {
                setLoggedIn(true)
                get()
            }
            else {
                reset()
                setLoggedIn(false)
            }
        }
    },[user.token])

    useEffect(() => {
        if(organiser)
            get()
    },[])

    return {isLoggedIn,isLoading,ongoing,expired,get,remove,create,reset}
}

export default useSessions
