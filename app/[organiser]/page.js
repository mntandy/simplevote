
import Sessions from "@/app/components/Sessions"
import { getVotingSessions } from "@/app/lib/server/votingSessions"

const Page = async ({ params }) => {
    const votingSessions = await getVotingSessions({organiser:params.organiser})

    return (<Sessions sessions={votingSessions} organiser={params.organiser}/>)
}

export default Page