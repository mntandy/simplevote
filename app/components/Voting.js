'use client'

import { useState, useEffect } from "react"
import RequestKey from '@/app/components/RequestKey'
import useVotingSession from '@/app/hooks/useVotingSession'

const BarSvg = ({votes,rowId}) => {
    const [rowHeight,setRowHeight] = useState(15)

    useEffect(() => {
        setRowHeight(document.getElementById(rowId).clientHeight)
    },[])

    return (
        <svg width={votes*2} height={rowHeight}>
            <rect width={votes*2} height={rowHeight} className="svgbar"/>
        </svg>
    )
}

const Countdown = ({timeleft}) => {
    if(timeleft)
        return <p> {timeleft} </p>
    return null
}

const useToggleState = () => {
    const [state,setState] = useState(false)
    const toggle = () => setState(!state)
    return [state,toggle]
}

const Voting = ({sessionId,sessionApi}) => {
    
    const [autoRefresh,toggleAutoRefresh] = useToggleState()
    
    const votingSession = useVotingSession({sessionId,sessionApi,autoRefresh})

    if (votingSession.requestKey) 
        return (<RequestKey submitKey={votingSession.submitKey}/>)
    else if (!votingSession.requestKey && !votingSession.description) 
        return (<p>Loading...</p>)
    else return (
        <div>
            <h1 align="center"> {votingSession.description} </h1>
            <div className="centered">
                <Countdown timeleft={votingSession.timeleft}/>
            </div>
            <div className="right-aligned">
            <label style={{fontSize:14, flexDirection:"row"}}>
                <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh}/>
                Auto-refresh
            </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Select</th>
                        <th colSpan={2}>Total votes</th>
                    </tr>
                </thead>
                <tbody>
                    {votingSession.options.map(e => 
                        <tr key={e.id} >
                            <td>{e.description}</td>
                            <td><button id={e.id} className={"voting-button " + (votingSession.ownVote===e.id? "voted" : null)} onClick={votingSession.handleVote(e.id)}>Vote!</button></td>
                            <td style={{paddingLeft:20}}><BarSvg votes={e.votes} rowId={e.id}/></td>
                            <td>{e.votes}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default Voting