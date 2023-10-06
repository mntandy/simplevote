import VotingSummary from '@/app/components/VotingSummary'
import Code from '@/app/components/Code'
            
const Page = ({ params }) => {
    return (    
        <>
            <Code sessionId={params.sessionId} organiser={params.organiser}/>
            <VotingSummary sessionId={params.sessionId} organiser={params.organiser}/>
        </>
    )
}

export default Page