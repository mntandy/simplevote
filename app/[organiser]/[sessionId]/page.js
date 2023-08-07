'use client'

import Voting from '@/app/components/Voting'
import Code from '@/app/components/Code'
import useApi from '@/app/hooks/useApi'

const Page = ({ params }) => {
    const sessionApi = useApi({path:`/vote/${params.organiser}/${params.sessionId}`})
    return (    
        <>
            <Code sessionApi={sessionApi}/>
            <Voting sessionId={params.sessionId} sessionApi={sessionApi}/>
        </>
    )
}

export default Page
