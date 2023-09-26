'use client'

import React, { useState } from "react"
import RequestKey from '@/app/components/RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'
import useCountdown from "@/app/hooks/useCountdown"
import '@/app/css/Voting.css'

const Countdown = ({ timeleft }) => {
    if (timeleft)
        return <div>{timeleft}</div>
    return null
}

const useToggleState = (initial) => {
    const [state, setState] = useState(initial)
    const toggle = () => setState(!state)
    return [state, toggle]
}

const Options = ({ options }) =>
    (!Array.isArray(options) || !options.length) ?
        <p align="center">Could not find anything...</p> :
        <div className="main-summary-voting-grid">
            {options.map(e =>
                <div className="summary-voting-box" key={e.id}>
                    <div style={{ padding: "1px", gridColumn: "1 / 2" }}>{e.description}</div>
                    <div style={{ gridColumn: "2 / 3", textAlign: "right", whiteSpace: "nowrap", alignSelf: "center"}}>
                        {"Total: " + e.votes}</div>
                </div>)}
        </div>

const VotingSummary = ({ sessionId, organiser }) => {

    const [autoRefresh, toggleAutoRefresh] = useToggleState(true)
    const [sort, toggleSort] = useToggleState(true)
    const votingSession = useVotingSession({ sessionId, organiser, autoRefresh })
    const { timeleft } = useCountdown(votingSession.expiration)


    if (votingSession.requestKey)
        return (<RequestKey submitKey={votingSession.submitKey} />)
    else if (!votingSession.requestKey && !votingSession.description)
        return (<p>Loading...</p>)
    else return (
        <div className="centered twentypxmargins column extra-gap">
            <h1 align="center">{votingSession.description}</h1>
            <Countdown timeleft={timeleft} />
            <div style={{ display: "flex" }}>
                <label className="radio label">
                    <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} />
                    Auto-refresh
                </label>
                <label className="radio label">
                    <input type="checkbox" checked={sort} onChange={toggleSort} />
                    Sort by most votes
                </label>
            </div>
            <Options options={sort ? votingSession.sortedOptions() : votingSession.options} />

        </div>
    )
}

export default VotingSummary