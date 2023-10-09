import Code from '@/app/components/Voting/Code'
import VotingShared from '@/app/components/Voting/VotingShared'            
const Page = ({ params }) => {
    return (    
        <>
            <Code sessionId={params.sessionId} organiser={params.organiser}/>
            <VotingShared sessionId={params.sessionId} organiser={params.organiser} summary={true}/>
        </>
    )
}

export default Page