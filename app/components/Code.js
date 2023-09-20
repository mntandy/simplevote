
import { getSessionKey } from "@/app/lib/server/votingSession"

const Code = async ({sessionId}) => {
    const sessionKey = await getSessionKey({sessionId})
    
    if(sessionKey)
        return (
            <div className="centered">
                <div className="container code">
                    <div>
                        <h3><b>Voting Code </b><b className="key">{sessionKey}</b></h3>
                    </div> 
                </div>
            </div>
        )
    else
        return null
}

export default Code