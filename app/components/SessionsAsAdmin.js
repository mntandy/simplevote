'use client'

import { useState } from 'react'
import CreateNewVote from "@/app/components/CreateNewVote"
import { fetchVotingSessions, deleteVotingSession } from '@/app/lib/client/apiCalls'
import { tryAndCatch } from '../lib/client/errorHandling'
import React from 'react'
import { isNonEmptyArray } from '../lib/basicutils'

const useVotingSessions = ({organiser,votingSessions}) => {
    const [sessions, setSessions] = useState(votingSessions)
    
    const updateSessions = async () => {
        const updatedSessions = await tryAndCatch(fetchVotingSessions, { organiser })
        if (updatedSessions)
            setSessions(updatedSessions)
    }

    const deleteSession = async (id) => {
        const success = await tryAndCatch(deleteVotingSession, { organiser, id })
        if (success)
            updateSessions()
    }

    return {sessions,updateSessions,deleteSession}
}
const SessionsAsAdmin = ({ organiser, votingSessions }) => {
    const {sessions,updateSessions,deleteSession} = useVotingSessions({organiser,votingSessions})
    const [displayCNS, setDisplayCNS] = useState(false)
    const [sessionForCopy, setSessionForCopy] = useState(null)
    const Session = ({ e, organiser }) => (<>{e.description} <a href={`/${organiser}/${e.id}`}>{"[voting view]"}</a> <a href={`/${organiser}/${e.id}/summary`}>{"[summary view]"}</a></>)

    const handleDelete = (id) => () => deleteSession(id)

    const handleCopy = (id) => () => {
        setSessionForCopy(id)
        setDisplayCNS(true)
    }

    const DeleteButton = ({ e }) =>
    (<button style={{ VerticalAlign: "baseline" }} className="session-button">
        <img onClick={handleDelete(e.id)}
            alt="delete session" src="/trash-outline.svg" width="16" height="16" />
    </button>)

    const CopyButton = ({ e }) =>
    (<button style={{ VerticalAlign: "baseline" }} className="session-button">
        <img onClick={handleCopy(e.id)}
            alt="make a copy of session" src="/copy-svgrepo-com.svg" width="16" height="16" />
    </button>)


    const EditButton = ({ e }) =>
    (<button style={{ VerticalAlign: "middle" }} className="session-button">
        <img onClick={() => { throw new Error("function is not implemented yet!") }}
            alt="edit session" src="/create-outline.svg" width="16" height="16" />
    </button>)

    const DisplaySessions = ({ arr, label }) =>
        !isNonEmptyArray(arr) ?
            <p align="center">Could not find any {label} voting sessions...</p> :
            <div className="grid-wrapper">
                {arr.map(e =>
                    <React.Fragment key={e.id}>
                        <span style={{alignSelf: "center", overflowWrap: "anywhere"}}><Session organiser={organiser} e={e} /></span>
                        <span style={{alignSelf: "center", marginLeft: "20px"}}><CopyButton e={e} /></span>
                        <span style={{alignSelf: "center"}}><DeleteButton e={e} /></span>
                    </React.Fragment>)}
            </div>

    if (displayCNS)
        return <CreateNewVote update={updateSessions} organiser={organiser} sessionId={sessionForCopy} close={() => setDisplayCNS(false)} />
    return (
        <div>
            <h1 align="center"> Ongoing voting sessions </h1>
            <DisplaySessions arr={sessions.ongoing} label="ongoing" />
            <h1 align="center"> Expired sessions </h1>
            <DisplaySessions arr={sessions.expired} label="expired" />
            <div className="center-aligned-flex column centered twentypxmargins" style={{padding: "20px"}}>
                <button className="button" onClick={() => setDisplayCNS(true)}>Create new voting session</button>
            </div>
        </div>)
}

export default SessionsAsAdmin