import { useState } from "react"
import { getClasses } from "@/app/lib/styles"

const RequestKey = ({organiser,submitKey}) => {
    const [key,setKey] = useState("")

    const handleSubmitKey = () => submitKey({key}) 

    return (
    <div className={getClasses(organiser,"container")}>
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

export default RequestKey