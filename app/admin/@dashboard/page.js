import SessionsAsAdmin from "@/app/components/SessionsAsAdmin"
  
import { getVotingSessions } from '@/app/lib/server/votingSessions'
import { getAuthSession } from "@/app/lib/server/authSession"

const Page = async () => {
    const authSession = await getAuthSession()
    const votingSessions = await getVotingSessions({organiser:authSession.user.nickname})
    return <SessionsAsAdmin organiser={authSession.user.nickname} votingSessions={votingSessions}/>
}
export default Page