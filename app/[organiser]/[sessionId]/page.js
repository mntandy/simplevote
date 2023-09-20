import Voting from '@/app/components/Voting'
import Code from '@/app/components/Code'
            
const Page = ({ params }) => {
    return (    
        <>
            <Voting sessionId={params.sessionId} organiser={params.organiser}/>
        </>
    )
}

export default Page
