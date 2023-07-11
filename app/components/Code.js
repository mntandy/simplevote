
import { useEffect, useState } from "react"

const useKey = (url,token,msg) => {
    const [key, setKey] = useState(null)

    useEffect(() => {
        const fetchKey = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    }
                })
                const body = await response.json()
                if(body.error)
                    msg.setError(body.error)
                else if("key" in body)
                    setKey(body.key)
            }
            catch(err) {
                console.log(err)
                msg.setError("could not fetch key.")
            }
        }

        fetchKey()
        return {key}
    },[])
}

export default function Code ({session,user,msg}) {
    const sessionKey = useKey(`/api/vote/${user.nickname}/${session}/key`,user.token,msg)
    
    return <h4 className="title is-4"> Code to vote: {sessionKey.key} </h4>
}