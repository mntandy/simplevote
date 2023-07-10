'use client'

import Voting from '@/app/components/Voting'
import useMessage from '@/app/hooks/useMessage'
import Message from '@/app/components/Message'

export default ({ params }) => {
    const msg = useMessage(null)
    
    return (    
        <>
            <Message msg={msg}/>
            <Voting organiser={params.organiser} session={params.session} msg={msg}/>
        </>
    )
}