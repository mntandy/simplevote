import { useState } from "react"

export default ({saveVotingToken,organiser,session,msg}) => {
    const [key,setKey] = useState("")
    const handleSubmitKey = async () => {
        try {
            const result = await fetch(`/api/vote/${organiser}/${session}/key`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key
                    }),
                })
            const body = await result.json()
            if(body.error)
                msg.set("is-danger",body.error)
            else {
                saveVotingToken(body.token)
            }
        }
        catch (exception) {
            console.log(exception)
            msg.set("is-danger","Something went wrong.")
        }
    }

    return (
    <div className="column is-half is-offset-one-quarter">
        <div className="field">
            <label className="label">Key</label>
            <input className="input" type="text" name="key" placeholder="Key" onChange={({target}) => setKey(target.value)} value={key}/>
            <div className="control">
                <button className="button is-link" onClick={handleSubmitKey}>Enter</button>
            </div>
        </div>
    </div>)
}