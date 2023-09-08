
import { getSessionKey } from "@/app/lib/server/votingSession"

const Code = async ({organiser,sessionId}) => {
    const sessionKey = await getSessionKey(sessionId)
    
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