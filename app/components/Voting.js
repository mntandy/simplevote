'use client'

import React from "react"
import RequestKey from '@/app/components/RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'
import useCountdown from "@/app/hooks/useCountdown"
import useToggleState from "../hooks/useToggleState"
import '@/app/css/Voting.css'
import { getClasses, getUserText } from "../lib/styles"
import { isNonEmptyArray } from "../lib/basicutils"

const Countdown = ({ timeleft }) => timeleft && <div>{timeleft}</div>

const Options = ({ organiser, options, info, myVotes, submitVote }) => {

    const UnvoteButton = ({ e }) =>
        myVotes.get(e.id) ?
            <div className={getClasses(organiser, "voting-button-div")}>
                <button
                    id={e.id + "unvote"}
                    className={getClasses(organiser, "voting-button")}
                    onClick={submitVote(e.id, false)}>
                    {getUserText(organiser, "unvoteButton")}
                </button>
            </div> :
            <div className={getClasses(organiser, "voting-button-div-disactivated")}>
                <button
                    id={e.id + "unvote"}
                    className={getClasses(organiser, "voting-button-disactivated")}
                    onClick={null}>
                    {getUserText(organiser, "unvoteButton")}
                </button>
            </div>


    const VoteButton = ({ e }) =>
        <div className={getClasses(organiser, "voting-button-div")}>
            <button
                id={e.id + "vote"}
                className={getClasses(organiser, "voting-button" + (myVotes.get(e.id) ? " voted" : ""))}
                onClick={submitVote(e.id, true)}>
                {getUserText(organiser, "voteButton")}
            </button>
        </div>

    return (!isNonEmptyArray(options) ?
        <p align="center">Could not find anything to vote for...</p> :
        <div className="main-voting-grid">
            {options.map(e =>
                <div className={getClasses(organiser, "voting-box")} key={e.id}>
                    <div className="voting-option">
                        {e.description}
                        {e.id in info && <span className="voting-info"><br />{getUserText(organiser, info[e.id])}</span>}
                    </div>
                    <div className="center-aligned-flex row centered" style={{ marginLeft: "auto", whiteSpace: "nowrap" }}>
                        <UnvoteButton e={e} />
                        <VoteButton e={e} />
                        {getUserText(organiser, "you")} {(myVotes.get(e.id) ?? "0")} {getUserText(organiser, "total")} {e.votes}</div>
                </div>)}
        </div>)
}


const Voting = ({ sessionId, organiser }) => {

    const [autoRefresh, toggleAutoRefresh] = useToggleState(false)
    const [sort, toggleSort] = useToggleState(false)
    const votingSession = useVotingSession({ sessionId, organiser, autoRefresh })
    const { timeleft } = useCountdown({ organiser, expiration: votingSession.expiration })

    const VotesLeft = () => votingSession.maxVotes !== null
        && votingSession.myVotes !== null
        && <div> {getUserText(organiser, "votesLeft")} {votingSession.maxVotes - votingSession.myVotes}</div>

    if (votingSession.requestKey)
        return (<RequestKey organiser={organiser} submitKey={votingSession.submitKey} />)
    else if (!votingSession.requestKey && !votingSession.description)
        return (<p>Loading...</p>)
    else return (
        <div className="center-aligned-flex column centered" style={{ rowGap: "20px" }}>
            <h1 align="center">{votingSession.description}</h1>
            <Countdown timeleft={timeleft} />
            <div style={{ display: "flex" }}>
                <label className="radio label">
                    <input
                        style={{ borderColor: "white" }}
                        type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} />
                    {getUserText(organiser, "refreshText")}
                </label>
                <label className="radio label">
                    <input type="checkbox" checked={sort} onChange={toggleSort} />
                    {getUserText(organiser, "sortText")}
                </label>
            </div>
            <VotesLeft />
            <Options
                organiser={organiser}
                myVotes={votingSession.currentVotes}
                submitVote={votingSession.handleVote}
                options={sort ? votingSession.sortedOptions() : votingSession.options}
                info={votingSession.info} />

        </div>
    )
}

export default Voting