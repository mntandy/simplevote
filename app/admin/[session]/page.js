'use client'

import Voting from '@/app/components/Voting'
import useMessage from '@/app/hooks/useMessage'
import Message from '@/app/components/Message'
import Code from '@/app/components/Code'
import useUser from "@/app/hooks/useUser"
import AdminNavbar from "@/app/components/AdminNavbar"

export default ({ params }) => {
    const msg = useMessage(null)
    const user = useUser(msg.setError)

    return (
        <>
        <AdminNavbar user={user}/>
        <div className="columns is-mobile is-centered">
            <div className="column is-narrow">
                {user.loading ? <p> loading...</p> :
                    (user.ok &&
                    <div className="box">
                        <Message msg={msg}/>
                        <Code session={params.session} user={user} msg={msg}/>
                        <Voting user={user} organiser={user.nickname} session={params.session} msg={msg}/>
                    </div>) ||
                    <p> you do not have permission to see anything here. <a href="/admin/">Log in first.</a></p>}
            </div>
        </div>
        </>
    )
}