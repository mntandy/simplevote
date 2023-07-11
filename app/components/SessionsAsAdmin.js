'use client'

import useSessions from '@/app/hooks/useSessions'

export default function SessionsAsAdmin({user}) {
    const sessions = useSessions({organiser:user.nickname,setError: msg.setError})

    const handleEdit = (id) => () => {}

    const handleDelete = (id) => async () => {
        try {
            const result = await fetch(`/api/vote/${organiser}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'authorization': 'Bearer ' + user.token,
                        'Content-Type': 'application/json',
                    }})
            const body = await result.json()
            if(body.error)
                msg.setError(body.error)
            else {
                msg.set("is-success","Voting session deleted.")
                sessions.refetch()
            }
        }
        catch (exception) {
            console.log(exception)
            msg.setError("Something went wrong.")
        }
    }
    const Session = ({e}) =>
        (<a href={"/admin/" + e.id}>{e.description}</a>)

    const DeleteButton = ({e}) => 
        (<button style={{VerticalAlign:"baseline"}} className="button is-small">
            <img onClick={handleDelete(e.id)} src="/trash-outline.svg" width="16" height="16"/>
        </button>)

    const EditButton = ({e}) => 
        (<button style={{VerticalAlign:"middle"}} className="button is-small">
            <img onClick={handleEdit(e.id)} src="/create-outline.svg" width="16" height="16"/>
        </button>)

    return (
        <>
            <h4 className="title is-4"> Voting sessions </h4>
            <div className="content">
            {sessions.isLoading && <p>Loading...</p>}
            {(!Array.isArray(sessions.ongoing) || !sessions.ongoing.length) ?
                <p>Could not find any ongoing voting sessions...</p> :
            (<table>
                <tbody>
                    {sessions.ongoing.map(e => 
                    <tr key={e.id}><td>
                        <span style={{float: "left"}}>
                            <Session e={e}/>
                        </span>
                        <span style={{float: "right"}}>
                            <EditButton e={e}/>
                            <DeleteButton e={e}/>
                        </span>
                    </td></tr>)}
                </tbody>
            </table>)}
            <h4 className="title is-4"> Expired sessions </h4>
            {(!Array.isArray(sessions.expired) || !sessions.expired.length) ? 
                <p>Could not find any expired voting sessions...</p> :
            <table>
                <tbody>
                {sessions.expired.map(e => 
                    <tr key={e.id}><td>
                        <span style={{float: "left"}}>
                            <Session e={e}/>
                        </span>
                        <span style={{float: "right"}}>
                            <DeleteButton e={e}/>
                        </span>
                    </td></tr>)}
                </tbody>
            </table>}
            </div>
        </>)
}