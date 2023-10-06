import Voting from '@/app/components/Voting'
            
const Page = ({ params }) => {
    return (    
        <>
            <Voting sessionId={params.sessionId} organiser={params.organiser}/>
        </>
    )
}

export default Page
