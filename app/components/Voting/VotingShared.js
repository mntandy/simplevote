'use client'

import React,{ useEffect, useState } from "react"
import RequestKey from './RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'
import useToggleState from "@/app/hooks/useToggleState"
import { getClasses, getUserText } from "@/app/lib/styles"
import RefreshAndSort from "./RefreshAndSort"
import OptionsForVoting from "./OptionsForVoting"
import OptionsAsSummary from "./OptionsAsSummary"
import { isNonEmptyArray } from "@/app/lib/basicutils"

const Countdown = ({ timeleft }) => timeleft && <div>{timeleft}</div>

const VotesLeft = ({ organiser, myVotes, maxVotes }) => maxVotes !== null
    && myVotes !== null
    && <div> {getUserText(organiser, "votesLeft")} {maxVotes - myVotes}</div>

const VotingShared = ({ sessionId, organiser, summary = false }) => {

    const sort = useToggleState(false)
    const votingSession = useVotingSession({ sessionId, organiser })

    if (votingSession.requestKey)
        return (<RequestKey organiser={organiser} submitKey={votingSession.submitKey} />)
    else if (
        (!votingSession.requestKey && votingSession.description === null) 
        || !isNonEmptyArray(votingSession.options.unSorted()))
        return (<div className="large-loader loader-colors" style={{margin: "50px"}}></div>)
    else return (
        <>
            <h1 align="center">{votingSession.description}</h1>
            <div
                className={"center-aligned-flex column centered " + getClasses(organiser, "content-box")}>
                <Countdown timeleft={votingSession.timeleft} />
                <RefreshAndSort organiser={organiser} autoRefresh={votingSession.autoRefresh} sort={sort} />
                {!summary ?
                    <>
                        <VotesLeft
                            organiser={organiser}
                            maxVotes={votingSession.maxVotes}
                            myVotes={votingSession.myVotes} />
                        <OptionsForVoting
                            organiser={organiser}
                            myVotes={votingSession.currentVotes}
                            submitVote={votingSession.submitVote}
                            options={sort.state ?
                                votingSession.options.sorted()
                                : votingSession.options.unSorted()}
                            info={votingSession.info} />
                    </>
                    : <OptionsAsSummary
                        organiser={organiser}
                        options={sort.state ?
                            votingSession.options.sorted()
                            : votingSession.options.unSorted()} />}
            </div>
        </>
    )
}

export default VotingShared