'use client'

import React, { useState, useEffect, useReducer } from "react"
import RequestKey from '@/app/components/RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'
import useCountdown from "@/app/hooks/useCountdown"
import '@/app/css/Voting.css'

const BarSvg = ({ votes, rowId }) => {
    const [rowHeight, setRowHeight] = useReducer(() => document.getElementById(rowId).clientHeight, 15)

    useEffect(() => {
        setRowHeight()
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

const useToggleState = (initial) => {
    const [state, setState] = useState(initial)
    const toggle = () => setState(!state)
    return [state, toggle]
}

const toSortedVotes = (options) => options.toSorted((a,b)=> a.votes<b.votes ? 1 : (a.votes>b.votes ? -1 : 0))

const Voting = ({ sessionId, organiser }) => {

    const [autoRefresh, toggleAutoRefresh] = useToggleState(false)
    const [sort, toggleSort] = useToggleState(false)
    const votingSession = useVotingSession({ sessionId, organiser, autoRefresh })
    const { timeleft } = useCountdown(votingSession.expiration)

    const UnvoteButton = ({ e }) =>
        <button
            id={e.id + "unvote"}
            className={"voting-button"}
            onClick={votingSession.handleVote(e.id, false)}>
            Unvote
        </button>

    const VoteButton = ({ e }) =>
        <button
            id={e.id + "vote"}
            className={"voting-button" + (votingSession.currentVotes.get(e.id) ? " voted" : "")}
            onClick={votingSession.handleVote(e.id, true)}>
            {"Vote" + "!".repeat(votingSession.currentVotes.get(e.id))}
        </button>

    const Options = ({ options, info }) =>
        (!Array.isArray(options) || !options.length) ?
            <p align="center">Could not find anything to vote for...</p> :
            <div className="voting-grid-wrapper">
                {options.map(e =>
                    <React.Fragment key={e.id}>
                        <span className="centered-item fix-wrap">{e.description} {e.id in info && <span className="voting-info"><br />{info[e.id]}</span>}</span>
                        <span className="centered-item">
                            <UnvoteButton e={e} />
                        </span>
                        <span className="centered-item">
                            <VoteButton e={e} />
                        </span>
                        <span className="centered-item"> {"Total: " + e.votes}</span>
                    </React.Fragment>)}
            </div>
    if (votingSession.requestKey)
        return (<RequestKey submitKey={votingSession.submitKey} />)
    else if (!votingSession.requestKey && !votingSession.description)
        return (<p>Loading...</p>)
    else return (
        <div className="centered twentypxmargins column extra-gap">
            <h1 align="center">{votingSession.description}</h1>
            <Countdown timeleft={timeleft} />
            <div style={{display: "flex"}}>
                <label className="radio label">
                    <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} />
                    Auto-refresh
                </label>
                <label className="radio label">
                    <input type="checkbox" checked={sort} onChange={toggleSort} />
                    Sort by total votes
                </label>
            </div>
            <Options options={sort ? toSortedVotes(votingSession.options) : votingSession.options} info={votingSession.info} />

        </div>
    )
}

export default Voting