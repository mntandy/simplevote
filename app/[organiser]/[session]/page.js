'use client'

import Voting from '@/app/components/Voting'
import useMessage from '@/app/hooks/useMessage'
import Message from '@/app/components/Message'

const Page = ({ params }) => {
    const msg = useMessage(null)
    
    return (    
        <>
            <Message msg={msg}/>
            <Voting organiser={params.organiser} session={params.session} msg={msg}/>
        </>
    )
}

export default Page