
import { getSessionKey } from "@/app/lib/server/votingSession"
import { getClasses, getUserText } from "../../lib/styles"

const Code = async ({ sessionId,organiser }) => {
    const sessionKey = await getSessionKey({ sessionId })
    if (sessionKey)
        return (
            <div className={getClasses(organiser,"container code")}>
                <h3><b>{getUserText(organiser,"votingCode")} </b><b className="key">{sessionKey}</b></h3>
            </div>
        )
    else
        return null
}

export default Code