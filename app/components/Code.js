
import { useEffect, useState } from "react"

export default ({session,user,msg}) => {
    const [key, setKey] = useState(null)

    const fetchKey = async () => {
        console.log(user.token)
        try {
            const response = await fetch(`/api/vote/${user.nickname}/${session}/key`, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + user.token,
                    'Content-Type': 'application/json',
                }
            })
            const body = await response.json()
            console.log(body)
            if(body.error)
                msg.set("is-danger", body.error)
            else if("key" in body)
                setKey(body.key)
        }
        catch(err) {
            console.log(err)
            msg.set("is-danger","could not fetch key.")
        }
    
    }
    useEffect(() => {
        fetchKey()
    },[])
    return <h4 className="title is-4"> Code to vote: {key} </h4>
}