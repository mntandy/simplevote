'use client'

import { useState, useEffect } from "react"
import RequestKey from '@/app/components/RequestKey'
import useCountdown from '@/app/hooks/useCountdown'
import 'bulma/css/bulma.min.css'

const BarSvg = ({votes,rowId}) => {
    const [rowHeight,setRowHeight] = useState(15)

    useEffect(() => {
        setRowHeight(document.getElementById(rowId).clientHeight)
    },[])

    return (
        <svg width={votes*2} height={rowHeight}>
            <rect width={votes*2} height={rowHeight} style={{fill:"hsl(204, 86%, 53%)", stroke: "white", strokewidth: "2"}}/>
        </svg>
    )
}

export default ({organiser, user, session, msg}) => {
    const [data,setData] = useState()
    const [votingToken,setVotingToken] = useState(null)
    const [requestKey,setRequestKey] = useState(false)
    const [previousVote,setPreviousVote] = useState(null)
    const countdown = useCountdown()
    
    const saveVotingToken = (t) => {
        setVotingToken(t)
        localStorage.setItem(organiser+session,t)
    }

    const fetchPreviousVoting = async () => {
        try {
            const response = await fetch(`/api/vote/${organiser}/${session}/token/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({votingToken})}  )
            const body = await response.json()
            if(!response.ok)
                msg.set("is-danger",body.error)
            else
                setPreviousVote(body.previousVote)
        }
        catch (error) {
            msg.set("is-danger","error fetching previous voting.")
        }
    }
    
    const fetchVotingData = async () => {
        const response = await fetch(`/api/vote/${organiser}/${session}`, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + votingToken,
                'Content-Type': 'application/json',
            }
        })
        const body = await response.json()
        
        if(body.error)
            msg.set("is-danger", body.error)
        else
            setData(body)
        
    }

    const checkUserToken = async () => {
        if(!user || !user.token)
            return true
        try {
            const response = await fetch(`/api/vote/${organiser}/${session}/user`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({userToken:user.token})}  )
            const body = await response.json()
            if(!body.token && body.error)
                    msg.set("is-danger",body.error)
            else {
                setVotingToken(body.token)
                return false
            }
        }
        catch (error) {
            msg.set("is-danger","error checking user token.")
        }
        return true
    }

    const fetchVotingRights = async () => {
        try {
            const response = await fetch(`/api/vote/${organiser}/${session}/token`)
            const body = await response.json()
            if(body.error)
                msg.set("is-danger", body.error)
            else if(body.protected) {
                setRequestKey(checkUserToken())
            }
            else saveVotingToken(body.token)
        }
        catch (error) {
            msg.set("is-danger", "something went wrong when obtaining voting rights.")
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem(organiser+session)
        if(storedToken)
            setVotingToken(storedToken)
        else
            fetchVotingRights()
    }, [])
    useEffect(() => {
        if(votingToken) {
            fetchVotingData()
            fetchPreviousVoting()
        }
    },[votingToken])

    useEffect(() => {
        if(data) 
            countdown.initialise(new Date(data.expiration))
    },[data])

    const handleVote = (id) => async () => {
        try {
            const response = await fetch(`/api/vote/${organiser}/${session}`, {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + votingToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            })
            const body = await response.json()
            if(body.error)
                msg.set("is-danger",body.error)
            else if(body.info)
                msg.set("is-info",body.info)
            else {
                saveVotingToken(body.token)
                setPreviousVote(id)
                fetchVotingData()
            }
        }
        catch (exception) {
            msg.set("is-danger","Something went wrong.")
        }
    }

    if (!votingToken && requestKey) return (<RequestKey saveVotingToken={saveVotingToken} organiser={organiser} session={session} msg={msg}/>)
    else if (!votingToken || !data) return (<p>Loading...</p>)
    else return (
        <>
            <h4 className="title is-4"> {data.description} </h4>
            {"expiration" in data && countdown.timeleft && <p> {countdown.timeleft} </p> }
            <table className="table is-narrow">
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Select</th>
                        <th>Total votes</th>
                    </tr>
                </thead>
                <tbody>
                    {data.options.map(e => 
                        <tr key={e.id} id={e.id}>
                            <td>{e.description}</td>
                            <td><button className={"button " + (previousVote===e.id? "is-success" : null)} onClick={handleVote(e.id)}>Vote!</button></td>
                            <td>
                                <span style={{float: "left"}}><BarSvg votes={e.votes} rowId={e.id}/></span>
                                <span style={{float: "right"}} id={e.description}>{e.votes}</span>
                            </td>
                        </tr>)}
                </tbody>
            </table>
        </>
    )
}