import { useState } from "react"

export default function RequestKey({submitKey}) {
    const [key,setKey] = useState("")

    const handleSubmitKey = () => submitKey({key}) 

    return (
    <div className="container">
        <div>
            <label>
                Enter key:
                <input type="text" name="key" placeholder="Key" onChange={({target}) => setKey(target.value)} value={key}/>
            </label>
            <div className="right-aligned">
                <button className="button right-align" onClick={handleSubmitKey}>Enter</button>
            </div>
        </div>
    </div>)
}