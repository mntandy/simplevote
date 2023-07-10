'use client'

import useSessions from '@/app/hooks/useSessions'

export default ({organiser="", msg}) => {
    const sessions = useSessions({organiser,setError: (text) => msg.set("is-danger",text)})
    const Session = ({e}) =>
        (<a href={"/" + organiser + "/" + e.id}>{e.description}</a>)
    return (
        <>
            <h4 className="title is-4"> Voting sessions </h4>
            <div className="content">
            {sessions.isLoading && <p>Loading...</p>}
            {(!Array.isArray(sessions.ongoing) || !sessions.ongoing.length) && 
                <>
                    <p>Could not find any ongoing voting sessions...</p> 
                    <p>If you are {organiser}, then you can <a href="/admin">log in to create a new voting session.</a></p>
                </>}
            <ul style={{listStyleType: "none"}}>
                {sessions.ongoing.map(e => 
                    <li key={e.id}>
                            <Session e={e}/>
                    </li>)}
            </ul>
            </div>
        </>)
}