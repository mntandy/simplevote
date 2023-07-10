'use client'
import Sessions from "../components/Sessions"
import Message from "@/app/components/Message"
import useMessage from "@/app/hooks/useMessage"

export default ({ params }) => {
    const msg = useMessage()
    
    return (
        <div className="container">
            <Message msg={msg}/>
            <Sessions organiser={params.organiser} msg={msg}/>
        </div>
    )
}