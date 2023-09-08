'use client'

import React, { useState, useEffect } from "react"
import RequestKey from '@/app/components/RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'
import '@/app/css/Voting.css'

const BarSvg = ({ votes, rowId }) => {
    const [rowHeight, setRowHeight] = useState(15)

    useEffect(() => {
        setRowHeight(document.getElementById(rowId).clientHeight)
    }, [])

    return (
        <svg width={votes * 2} height={rowHeight}>
            <rect width={votes * 2} height={rowHeight} className="svgbar" />
        </svg>
    )
}

const Countdown = ({ timeleft }) => {
    if (timeleft)
        return <div>{timeleft}</div>
    return null
}

const useToggleState = () => {
    const [state, setState] = useState(false)
    const toggle = () => setState(!state)
    return [state, toggle]
}

const Voting = ({ sessionId, organiser }) => {

    const [autoRefresh, toggleAutoRefresh] = useToggleState()

    const votingSession = useVotingSession({ sessionId, organiser, autoRefresh })
    
    const VoteButton = ({ e }) =>
        <button
            id={e.id}
            className={"voting-button" + (votingSession.previousVote === e.id ? " voted" : "")}
            onClick={votingSession.handleVote(e.id)}>
            Vote!
        </button>

    const Options = ({ options }) =>
        (!Array.isArray(options) || !options.length) ?
            <p align="center">Could not find anything to vote for...</p> :
            <div className="voting-grid-wrapper">
                {options.map(e =>
                    <React.Fragment key={e.id}>
                        <span className="centered-item fix-wrap">{e.description}</span>
                        <span className="centered-item">
                            <VoteButton e={e} />
                        </span>
                        <span className="centered-item">
                            <BarSvg votes={e.votes} rowId={e.id} />
                        </span>
                        <span className="centered-item">{e.votes}</span>
                    </React.Fragment>)}
            </div>

    if (votingSession.requestKey)
        return (<RequestKey submitKey={votingSession.submitKey} />)
    else if (!votingSession.requestKey && !votingSession.description)
        return (<p>Loading...</p>)
    else return (
        <div className="centered column extra-gap">
            <h1 align="center">{votingSession.description}</h1>
            <Countdown timeleft={votingSession.timeleft} />
            <label className="radio label">
                <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} />
                Auto-refresh
            </label>
            <Options options={votingSession.options} />

        </div>
    )
}

export default Voting