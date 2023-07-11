'use client'
import { useState } from "react"
import CreateNewVote from "../components/CreateNewVote"

export default function Settings({setUser,user,toggleNewUser,msg}) {
    const [settingsState,setSettingsState] = useState(null)
    
    const changeState = (newState) => () => {
        setSettingsState(newState)
    }

    switch(settingsState) {
        case "createvote": return <CreateNewVote user={user} msg={msg} setSettingsState={setSettingsState}/>
        default: return (
                <div className="container">
                    <div className="column is-half is-offset-one-quarter">
                    <div className="control">
                        <button className="button" onClick={changeState("nickname")}>Change nickname</button>
                    </div>
                    <div className="control">
                        <button className="button" onClick={changeState("password")}>Change password</button>
                    </div>
                    <div className="control">
                        <button className="button" onClick={changeState("managevotes")}>Manage existing voting sessions</button>
                    </div>
                    <div className="control">
                        <button className="button" onClick={changeState("createvote")}>Create new voting session</button>
                    </div>
                    </div>
                </div>
            )
    }
    
}