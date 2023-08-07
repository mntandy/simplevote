'use client'

import { MessageContext, UserContext } from '@/app/contexts'
import { useContext } from 'react'

const SessionsAsAdmin = ({sessions,handleCreateNew}) => {
    const msg = useContext(MessageContext)
    const user = useContext(UserContext)
    const Session = ({e,organiser}) => (<a href={`/${organiser}/${e.id}`}>{e.description}</a>)

    const DeleteButton = ({e,}) => 
        (<button style={{VerticalAlign:"baseline"}} className="session-button">
            <img onClick={() => sessions.deleteSession({id:e.id})} 
                src="/trash-outline.svg" width="16" height="16"/>
        </button>)

    const EditButton = ({e}) => 
        (<button style={{VerticalAlign:"middle"}} className="session-button">
            <img onClick={() => msg.setInfo("function is not implemented yet!")}
                src="/create-outline.svg" width="16" height="16"/>
        </button>)
    return (
        <div>
        <div>
            <h1 align="center"> Ongoing voting sessions </h1>
            {(!Array.isArray(sessions.ongoing) || !sessions.ongoing.length) ?
                <p align="center">Could not find any ongoing voting sessions...</p> :
            (<table align="center">
                <tbody>
                    {sessions.ongoing.map(e => 
                    <tr key={e.id}><td>
                        <span style={{float: "left"}}>
                            <Session organiser={user.nickname} e={e}/>
                        </span>
                        <span style={{float: "right"}}>
                            <EditButton e={e}/>
                            <DeleteButton e={e}/>
                        </span>
                    </td></tr>)}
                </tbody>
            </table>)}
            <h1 align="center"> Expired sessions </h1>
            {(!Array.isArray(sessions.expired) || !sessions.expired.length) ? 
                <p>Could not find any expired voting sessions...</p> :
            <table align="center">
                <tbody>
                {sessions.expired.map(e => 
                    <tr key={e.id}><td>
                        <span style={{float: "left"}}>
                            <Session organiser={user.nickname} e={e}/>
                        </span>
                        <span style={{float: "right"}}>
                            <DeleteButton e={e}/>
                        </span>
                    </td></tr>)}
                </tbody>
            </table>}
        </div>
        <div className="centered extra-padding">
            <button className="button" onClick={handleCreateNew}>Create new voting session</button>
        </div>
    </div>)
}

export default SessionsAsAdmin