
import { useEffect, useState, useContext } from "react"
import { UserContext } from '@/app/contexts'

const useKey = ({sessionApi}) => {
    const [key, setKey] = useState(null)
    const user = useContext(UserContext)

    useEffect(() => {
        const fetchKey = async () => {
            const responseBody = sessionApi.get({
                url:'/key',
                token:user.token,
                expectedProperties:[["key","protected"]]
            })
            if(responseBody?.key)
                setKey(responseBody.key)
        }
        if(user.token)
            fetchKey()
    },[user.token])
    return key
}

const Code = ({sessionApi}) => {
    const sessionKey = useKey({sessionApi})
    
    if(sessionKey)
        return (
            <div className="container code">
                <div>
                    <h3 className="centered"><b>Kode</b></h3>
                    <h1><b className="key">{sessionKey}</b></h1>
                </div> 
            </div>
        )
    else
        return null
}

export default Code