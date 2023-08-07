'use client'

import { useContext, useCallback } from "react"
import { MessageContext, UserContext } from "@/app/contexts"


const areExpectedPropertiesPresent = (body,expectedProperties) => 
    expectedProperties.some(
        property => 
            (typeof property === "string" && !(property in body))
            ||
            (Array.isArray(property) && (!(property.some(e => (e in body))))))

const headerWithOrWithoutToken = (token) => 
    token ? 
        ({
            'authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        })
        : ({
            'Content-Type': 'application/json',
        })

const useApi = ({path=""}) => {
    const msg = useContext(MessageContext)
    const user = useContext(UserContext)

    const handleError = useCallback(({body,additionalTest={},expectedProperties}) => {
        if(body.expired || body.invalid) {
            msg.setError("You have been logged out.")
            user.logout()
        }
        else if(body.error)
            msg.setError(body.error)
        else if(Array.isArray(expectedProperties)
                && areExpectedPropertiesPresent(body,expectedProperties))
            msg.setError("The response from the server was not as expected.")
        else if("func" in additionalTest && !additionalTest.func(body)) {
            msg.setError("error" in additionalTest && additionalTest.error)
        }
        else
            return body
        return null
    },[msg,user])

    const post = async ({url="",token,requestBody,additionalTest,expectedProperties}) => {
        try {
            const response = await fetch(`/api${path}${url}`, {
                method: 'POST',
                headers: headerWithOrWithoutToken(token),
                body: JSON.stringify(requestBody)
            })
            const body = await response.json()
            return handleError({body,additionalTest,expectedProperties})
        }
        catch (exception) {
            console.log(exception)
            msg.setError("Something went wrong with a post request.")
        }
        return null
    }

    const get = async ({url="",token,additionalTest,expectedProperties}) => {
        try {
            const response = await fetch(`/api${path}${url}`, {
                method: 'GET',
                headers: headerWithOrWithoutToken(token)
            })
            const body = await response.json()
            return handleError({body,additionalTest,expectedProperties})
        }
        catch (exception) {
            console.log(exception)
            setError("Something went wrong with a get request.")
        }
        return null
    }

    const del = async ({url,token,additionalTest,expectedProperties}) => {
        try {
            const response = await fetch(`/api${path}${url}`, {
                method: 'DELETE',
                headers: headerWithOrWithoutToken(token)
            })
            const body = await response.json()
            if(!handleError({body,additionalTest,expectedProperties}))
                return body
        }
        catch (exception) {
            console.log(exception)
            setError("Something went wrong with a get request.")
        }
        return null

    }

    return {post,get,del}
}

export default useApi