import { containsNonEmptyArray } from "../lib/basicutils"
import { getUserText, getClasses } from "../lib/styles"
const Sessions = ({ sessions, organiser }) => {
    
    const Session = ({ e }) =>
        (<a style={{margin: "5px"}} href={"/" + organiser + "/" + e.id}>{e.description}</a>)
    
    return (
        <>
            <h1 align="center"> {getUserText(organiser,"sessionsHeading")} </h1>
            <div
                className={"center-aligned-flex column centered " + getClasses(organiser, "content-box")}>
                {!containsNonEmptyArray(sessions,"ongoing") ? 
                    <p>{getUserText(organiser,"sessionsIntro")}</p> 
                    : sessions.ongoing.map(e => <Session key={e} e={e} />)}
            </div>
        </>)
}

export default Sessions