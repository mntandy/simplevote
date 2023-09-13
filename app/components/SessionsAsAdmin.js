'use client'

import { useState } from 'react'
import CreateNewVote from "@/app/components/CreateNewVote"
import { fetchVotingSessions, deleteVotingSession } from '@/app/lib/client/apiCalls'
import { tryAndCatch } from '../lib/client/errorHandling'
import React from 'react'

const SessionsAsAdmin = ({ organiser, votingSessions }) => {
    const [sessions, setSessions] = useState(votingSessions)
    const [displayCNS, setDisplayCNS] = useState(false)
    const [sessionForCopy, setSessionForCopy] = useState(null)
    const Session = ({ e, organiser }) => (<a href={`/${organiser}/${e.id}`}>{e.description}</a>)

    const updateVotingSessions = async () => {
        const updatedSessions = await tryAndCatch(fetchVotingSessions, { organiser })
        if (updatedSessions)
            setSessions(updatedSessions)
    }

    const handleDelete = (id) => async () => {
        const success = await tryAndCatch(deleteVotingSession, { organiser, id })
        if (success)
            updateVotingSessions()
    }

    const handleCopy = (id) => () => {
        setSessionForCopy(id)
        setDisplayCNS(true)
    }

    const DeleteButton = ({ e }) =>
    (<button style={{ VerticalAlign: "baseline" }} className="session-button">
        <img onClick={handleDelete(e.id)}
            src="/trash-outline.svg" width="16" height="16" />
    </button>)

    const CopyButton = ({ e }) =>
    (<button style={{ VerticalAlign: "baseline" }} className="session-button">
        <img onClick={handleCopy(e.id)}
            src="/copy-svgrepo-com.svg" width="16" height="16" />
    </button>)


    const EditButton = ({ e }) =>
    (<button style={{ VerticalAlign: "middle" }} className="session-button">
        <img onClick={() => { throw new Error("function is not implemented yet!") }}
            src="/create-outline.svg" width="16" height="16" />
    </button>)

    const DisplaySessions = ({ arr, label }) =>
        (!Array.isArray(arr) || !arr.length) ?
            <p align="center">Could not find any {label} voting sessions...</p> :
            <div className="grid-wrapper">
                {arr.map(e =>
                    <React.Fragment key={e.id}>
                        <span className="centered-item fix-wrap"><Session organiser={organiser} e={e} /></span>
                        <span className="centered-item left-margin"><CopyButton e={e} /></span>
                        <span className="centered-item"><DeleteButton e={e} /></span>
                    </React.Fragment>)}
            </div>

    if (displayCNS)
        return <CreateNewVote update={updateVotingSessions} organiser={organiser} sessionId={sessionForCopy} close={() => setDisplayCNS(false)} />
    return (
        <div>
            <h1 align="center"> Ongoing voting sessions </h1>
            <DisplaySessions arr={sessions.ongoing} label="ongoing" />
            <h1 align="center"> Expired sessions </h1>
            <DisplaySessions arr={sessions.expired} label="expired" />
            <div className="centered extra-padding">
                <button className="button" onClick={() => setDisplayCNS(true)}>Create new voting session</button>
            </div>
        </div>)
}

export default SessionsAsAdmin