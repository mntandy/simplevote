import VotingShared from '@/app/components/Voting/VotingShared'
            
const Page = ({ params }) => {
    return (    
        <>
            <VotingShared sessionId={params.sessionId} organiser={params.organiser}/>
        </>
    )
}

export default Page
