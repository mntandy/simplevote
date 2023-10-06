
import Sessions from "@/app/components/Sessions"
import { getVotingSessions } from "@/app/lib/server/votingSessions"
import { getAuthSession } from "../lib/server/authSession"
import SessionsAsAdmin from "../components/SessionsAsAdmin"

const Page = async ({ params }) => {
    const votingSessions = await getVotingSessions({organiser:params.organiser})
    const authSession = await getAuthSession()
    if(authSession && authSession.user.nickname===params.organiser) {
        const votingSessions = await getVotingSessions({organiser:authSession.user.nickname})
        return <SessionsAsAdmin organiser={authSession.user.nickname} votingSessions={votingSessions}/>
    }
    else
        return (<Sessions sessions={votingSessions} organiser={params.organiser}/>)
}

export default Page