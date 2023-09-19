
import { getSessionKey } from "@/app/lib/server/votingSession"

const Code = async ({sessionId}) => {
    const sessionKey = await getSessionKey({sessionId})
    
    if(sessionKey)
        return (
            <div className="centered">
                <div className="container code">
                    <div>
                        <h3><b>Voting Code</b></h3>
                        <h1><b className="key">{sessionKey}</b></h1>
                    </div> 
                </div>
            </div>
        )
    else
        return null
}

export default Code