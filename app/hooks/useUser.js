'use client'

import { useEffect, useState } from "react"

const useUser = (setError) => {
    const [token,setToken] = useState(null)
    const [email,setEmail] = useState(null)
    const [nickname,setNickname] = useState(null)
    const [ok,setOk] = useState(false)
    const [loading,setLoading] = useState(true)

    const logout = () => {
        setToken(null)
        setEmail(null)
        setNickname(null)
        sessionStorage.removeItem("vote4user")
    }

    const set = ({token,email,nickname}) => {
        setToken(token)
        setEmail(email)
        setNickname(nickname)
        sessionStorage.setItem("vote4user",token)
        setOk(true)
    }

    const login = async ({email,password}) => {
        try {
            const result = await fetch('/api/auth/login/', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                })
            const body = await result.json()
            if(body.error)
                setError(body.error)
            else {
                set(body)
            }
        }
        catch (exception) {
            setError("Something went wrong.")
        }
    }

    const verifyToken = async (newToken) => {
        try {
            const result = await fetch('/api/auth/token/', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token:newToken,
                    }),
                })
            const body = await result.json()
            if(body.error)
                setError(body.error)
            else if(body.expired)
                logout()
            else if(body.token!==newToken || !body.email || !body.nickname)
                setError("something went wrong.")
            else
                set(body)
        }
        catch (exception) {
            setError("Something went wrong.")
        }
        setLoading(false)
    }

    const getUserTokenFromStorage = () => {
        const storedToken = sessionStorage.getItem("vote4user")
        if(storedToken)
            verifyToken(storedToken)
        else
            setLoading(false)
    }

    useEffect(() => {
        getUserTokenFromStorage()
    },[])


    return {login,ok,set,nickname,email,token,logout,loading}
}

export default useUser