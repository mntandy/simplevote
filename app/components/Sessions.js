'use client'

const Sessions = ({sessions,organiser}) => {
    const Session = ({e}) =>
        (<a href={"/" + organiser + "/" + e.id}>{e.description}</a>)

    
    return (
        <>
            <h1 align="center"> Live sessions </h1>
            <div className="centered">
            {(!Array.isArray(sessions.ongoing) || !sessions.ongoing.length) && 
                <>
                    <p>Could not find any ongoing voting sessions...</p> 
                    <p>If you are {organiser}, then you can <a href="/admin">log in to create a new voting session.</a></p>
                </>}
            <div>
                {sessions.ongoing.map(e => 
                    <Session key={e} e={e}/>)}
            </div>
            </div>
        </>)
}

export default Sessions