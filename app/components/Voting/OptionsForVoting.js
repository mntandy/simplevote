import { getClasses, getUserText } from "../../lib/styles"
import { useState } from "react"

const Loader = ({ organiser }) => 
    <div className="center-aligned-flex centered">
        <div className="loader loader-colors"></div>
    </div>

const VoteButton = ({ organiser, id, voteSubmitted, handleSubmitVote, textKey, value, voted }) =>
    <div className={getClasses(organiser, "voting-button-div")}>
        <button
            id={id + textKey}
            className={getClasses(organiser, "voting-button" + (voted ? " voted" : ""))}
            onClick={!voteSubmitted ? handleSubmitVote(id, value) : undefined}>
            {(voteSubmitted === (id + textKey)) ? <Loader organiser={organiser} /> : getUserText(organiser, textKey)}
        </button>
    </div>

const OptionsForVoting = ({ organiser, options, info, myVotes, submitVote }) => {
    const [voteSubmitted, setVoteSubmitted] = useState(null)

    const handleSubmitVote = (id, value) => async () => {
        setVoteSubmitted(id + (value ? "voteButton" : "unvoteButton"))
        await submitVote(id, value)
        setVoteSubmitted(null)
    }
    return (
        <div className="main-voting-grid">
            {options.map(e =>
                <div className={getClasses(organiser, "voting-box")} key={e.id}>
                    <div className="center-aligned-flex column centered voting-option" >
                        <div style={{ textAlign: "center", fontWeight: "bold" }}>{e.description}</div>
                        {e.id in info && <div className="voting-info">{getUserText(organiser, info[e.id])}</div>}
                    </div>
                    <div className="center-aligned-flex row centered" style={{ whiteSpace: "nowrap" }}>
                        {myVotes.get(e.id) &&
                            <VoteButton
                                organiser={organiser}
                                id={e.id}
                                handleSubmitVote={handleSubmitVote}
                                value={false}
                                textKey="unvoteButton"
                                voted={true}
                                voteSubmitted={voteSubmitted} />}
                        <VoteButton
                            organiser={organiser}
                            id={e.id}
                            handleSubmitVote={handleSubmitVote}
                            value={true}
                            textKey="voteButton"
                            voted={myVotes.get(e.id)}
                            voteSubmitted={voteSubmitted} />
                    </div>
                    <div>{getUserText(organiser, "you")} {(myVotes.get(e.id) ?? "0")} {getUserText(organiser, "total")} {e.votes}</div>
                </div>)}
        </div>)
}

export default OptionsForVoting