'use client'

import { useState,useEffect } from "react"
import useApi from "@/app/hooks/useApi"

const useUser = () => {
    const [token,setToken] = useState(null)
    const [email,setEmail] = useState(null)
    const [nickname,setNickname] = useState(null)
    const authApi = useApi({path:"/auth"})

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
    }

    const login = async ({email,password}) => {
        if(authApi) {
            const responseBody = await authApi.post({
                url:"/login",
                requestBody:{email,password},
                expectedProperties:["token","email","nickname"]})
                if(responseBody)
                    set(responseBody)
        }
    }

    const verifyToken = async (newToken) => {
        if(authApi) {
            const responseBody = await authApi.post({
                logout,
                url:"/token",
                requestBody:{token:newToken},
                expectedProperties:["token","email","nickname"],
                additionalTest: {
                    func: (body) => (body.token===newToken),
                    error: "Bad data received from server."
                },
            })
            if(responseBody)
                set(responseBody)
            else
                logout()
        }
    }

    const getTokenFromStorage = () => sessionStorage.getItem("vote4user")

    const processToken = (storedToken) => {
        if(storedToken)
            verifyToken(storedToken)
    }

    useEffect(() => {
        processToken(getTokenFromStorage())
    },[])

    return {login,nickname,email,token,logout}
}

export default useUser