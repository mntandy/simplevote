'use client'
import { useState } from "react"
import Login from "@/app/components/Login"
import Register from "@/app/components/Register"
import Settings from "@/app/components/Settings"
import Message from "@/app/components/Message"
import useMessage from "@/app/hooks/useMessage"

const Page = () => {

    const [user, setUser] = useState(null)
    const [newUser,setNewUser] = useState(false)
    const msg = useMessage()
    
    const toggleNewUser = (event) => {
        event.preventDefault()
        setNewUser(!newUser)
    }

    return (
        <div>
            <Message msg={msg}/>
            {!user && newUser && <Register setUser={setUser} toggleNewUser={toggleNewUser} msg={msg}/>}
            {!user && !newUser && <Login setUser={setUser} toggleNewUser={toggleNewUser} msg={msg}/>}
            {user && <Settings user={user} msg={msg}/>}
        </div>
    )
}

export default Page
