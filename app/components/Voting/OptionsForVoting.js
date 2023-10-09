import { getClasses, getUserText } from "../../lib/styles"
import { isNonEmptyArray } from "../../lib/basicutils"

const OptionsForVoting = ({ organiser, options, info, myVotes, submitVote }) => {

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

export default OptionsForVoting