import { containsNonEmptyArray } from "../lib/basicutils"
import { getUserText } from "../lib/styles"
const Sessions = ({ sessions, organiser }) => {
    
    const Session = ({ e }) =>
        (<a className="twentypxmargins" href={"/" + organiser + "/" + e.id}>{e.description}</a>)
    
    return (
        <>
            <h1 align="center"> {getUserText(organiser,"sessionsHeading")} </h1>
            <div className="center-aligned-flex column centered twentypxmargins">
                {!containsNonEmptyArray(sessions,"ongoing") ? 
                    <p>{getUserText(organiser,"sessionsIntro")}</p> 
                    : sessions.ongoing.map(e => <Session key={e} e={e} />)}
            </div>
        </>)
}

export default Sessions