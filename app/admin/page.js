'use client'
import { useState, useEffect } from "react"
import Login from "@/app/components/Login"
import Sessions from "@/app/components/Sessions"
import Message from "@/app/components/Message"
import useMessage from "@/app/hooks/useMessage"
import CreateNewVote from "@/app/components/CreateNewVote"
import AdminNavbar from "@/app/components/AdminNavbar"
import useUser from "@/app/hooks/useUser"
import SessionsAsAdmin from "@/app/components/SessionsAsAdmin"

export default () => {
    const msg = useMessage()
    const user = useUser(msg.setError)
    const [state, setState] = useState("ongoing")
    const resetState = () => setState("ongoing")
    
    return (
        <>
        <AdminNavbar user={user}/>
        <div className="columns is-mobile is-centered">
        <div className="column is-narrow">
            <Message msg={msg}/>
            <div className="box">
            {!user.ok && <Login user={user}/>}
            {user.ok && state==="ongoing" &&
            <>
                <SessionsAsAdmin user={user}/>
                <button className="button" onClick={() => setState("newvote")}>Create new voting session</button>
            </>}
            {user.ok && state==="newvote" &&
                <CreateNewVote msg={msg} user={user} resetState={resetState}/>}
            </div>
        </div>
        </div>
        </>)
}
