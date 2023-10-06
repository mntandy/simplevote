'use client'

import React from "react"
import RequestKey from '@/app/components/RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'
import useCountdown from "@/app/hooks/useCountdown"
import '@/app/css/Voting.css'
import { getClasses, getUserText } from "../lib/styles"
import useToggleState from "../hooks/useToggleState"
import { isNonEmptyArray } from "../lib/basicutils"

const Countdown = ({ timeleft }) => timeleft && <div>{timeleft}</div>

const Options = ({ organiser, options }) =>
    !isNonEmptyArray(options) ?
        <p align="center">Could not find anything...</p> :
        <div className="main-summary-voting-grid">
            {options.map(e =>
                <div className={getClasses(organiser, "summary-voting-box")} key={e.id}>
                    <div style={{ padding: "1px", gridColumn: "1 / 2" }}>{e.description}</div>
                    <div style={{ gridColumn: "2 / 3", textAlign: "right", whiteSpace: "nowrap", alignSelf: "center" }}>
                        {"Total: " + e.votes}</div>
                </div>)}
        </div>

const VotingSummary = ({ sessionId, organiser }) => {

    const [autoRefresh, toggleAutoRefresh] = useToggleState(true)
    const [sort, toggleSort] = useToggleState(true)
    const votingSession = useVotingSession({ sessionId, organiser, autoRefresh })
    const { timeleft } = useCountdown({organiser,expiration:votingSession.expiration})

    if (votingSession.requestKey)
        return (<RequestKey organiser={organiser} submitKey={votingSession.submitKey} />)
    else if (!votingSession.requestKey && !votingSession.description)
        return (<p>Loading...</p>)
    else return (
        <>
            <h1 align="center">{votingSession.description}</h1>
            <Countdown timeleft={timeleft} />
            <div style={{ display: "flex" }}>
                <label className="radio label">
                    <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} />
                    {getUserText(organiser, "refreshText")}
                </label>
                <label className="radio label">
                    <input type="checkbox" checked={sort} onChange={toggleSort} />
                    {getUserText(organiser, "sortText")}
                </label>
            </div>
            <Options organiser={organiser} options={sort ? votingSession.sortedOptions() : votingSession.options} />
        </>
    )
}

export default VotingSummary