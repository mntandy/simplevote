'use client'
import { useState } from "react"

export default ({user,msg,resetState}) => {
    
    const initialForm = {
        description: "",
        duration: "60",
        optionsInput: "",
        access: "protected",
        key: "",
    }

    const [form, setForm] = useState(initialForm)

    const [options, setOptions] = useState([])

    const handleChange = ({ target }) => {
        setForm({...form,[target.name]: target.value})
    }
    
    const handleAddOptions = () => {
        setOptions(options.concat(form.optionsInput.split("\n").filter(e => e!=="")))
        setForm({...form,optionsInput: ""})
    }

    const handleClearOptions = () => {
        setForm({...form,options: []})
    }

    const handleCancel = () => {
        handleClearOptions()
        resetState()
    }
    
    const handleStartSession = async () => {
        if(!Array.isArray(options) || !options.length)
            msg.set("is-info","Please add some options by writing them in the textbox and clicking \" add options\"")
        else {
        try {
            const result = await fetch('/api/vote/create', {
                    method: 'POST',
                    headers: {
                        'authorization': 'Bearer ' + user.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: form.description,
                        duration: form.duration,
                        options,
                        protected: (form.access==="protected"),
                        key: form.key,
                    })
                    })
            const body = await result.json()
            if(body.error)
                msg.set("is-danger",body.error)
            else {
                setForm(initialForm)
                setOptions([])
                msg.set("is-success","Vote session created.")
                resetState()
            }
        }
        catch (exception) {
            msg.set("is-danger","Something went wrong.")
        }
    }
    }

    return (
        <>
          <div className="field">
                    <label className="label">Name</label>
                    <input className="input" type="text" name="description" placeholder="Description" onChange={handleChange} value={form.description}/>
                </div>
                <div className="field">
                    <label className="label">Duration in minutes</label>
                    <input className="input" type="number" name="duration" onChange={handleChange} value={form.duration}/>
                </div>

                <div className="control">
                    <label className="label">Add options (add multiple at once, separated by new-line):</label>
                    <textarea className="textarea has-fixed-size" rows="5" name="optionsInput" onChange={handleChange} value={form.optionsInput} placeholder="Fixed size textarea"></textarea>
                    <button className="button" onClick={handleAddOptions}>Add options</button>
                </div>
                {Array.isArray(options) && !!options.length && 
                <div className="field">
                    <label className="label">Current options:</label>
                   <ul>{options.map(v => <li key={v}>{v}</li>)}</ul>
                </div>}
                <div className="control">
                    <label className="radio">
                        <input type="radio" name="access" onChange={handleChange} value="public"/> Public
                    </label>
                    <label className="radio">
                        <input type="radio" name="access" onChange={handleChange} value="protected" checked/> Protected 
                    </label>
                </div>
                {form.access==="protected" &&
                    <div className="field">
                        <label className="label">Key</label>
                        <input className="input" type="text" name="key" placeholder="Key" onChange={handleChange} value={form.key}/>
                    </div>}
                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-link is-light" onClick={handleClearOptions}>Clear options</button>
                    </div>
                    <div className="control">
                        <button className="button is-link is-light" onClick={handleCancel}>Cancel</button>
                    </div>
                    <div className="control">
                        <button className="button is-link" onClick={handleStartSession}>Create voting session</button>
                    </div>
                </div>
        </>
    )
}
