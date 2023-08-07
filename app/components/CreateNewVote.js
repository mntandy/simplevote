'use client'
import { useState } from "react"

const CreateNewVote = ({sessions,close,user}) => {
    
    const initialForm = {
        description: "",
        duration: "60",
        optionsInput: "",
        access: "protected",
        key: "",
    }

    const [form, setForm] = useState(initialForm)

    const [options, setOptions] = useState([])
    const [optionsInfo, setOptionsInfo] = useState(false)

    const optionsAreOk = () => (Array.isArray(options) && !!options.length)

    const handleChange = ({ target }) => {
        setForm({...form,[target.name]: target.value})
    }
    
    const handleAddOptions = () => {
        setOptions([...(new Set([...options,...form.optionsInput.split("\n").filter(e => e!=="")])).values()])
        setForm({...form,optionsInput: ""})
    }

    const handleClearOptions = () => {
        setForm({...form,options: []})
    }

    const handleCancel = () => {
        handleClearOptions()
        close()
    }

    const handleCreateSession = async () => {
        if(!optionsAreOk())
            setOptionsInfo(true)
        else {
            const success = await sessions.create({
                session:{
                    description: form.description,
                    duration: form.duration,
                    options,
                    protected: (form.access==="protected"),
                    key: form.key
                },
                user
            })
            if(success) {
                setForm(initialForm)
                setOptions([])
                setOptionsInfo(false)
                close()
                sessions.get({organiser:user.nickname})
            }
        }
    }
    return (
        <div className="extra-padding">
            <label className="label">
                Name
                <input className="input" type="text" name="description" placeholder="Description" onChange={handleChange} value={form.description}/>
            </label>                
            <label className="label">
                Duration in minutes
                <input className="input" type="number" name="duration" onChange={handleChange} value={form.duration}/>
            </label>
            <label className="label">Add options (add multiple at once, separated by new-line):
                <textarea className="textarea has-fixed-size" rows="5" name="optionsInput" onChange={handleChange} value={form.optionsInput}></textarea></label>
                    {optionsInfo && <p class="help is-danger">Please add some options by writing them in the textbox and clicking "add options"</p>}
            <button className="button" onClick={handleAddOptions}>Add options</button>
                {optionsAreOk() && 
                    <label className="label">Current options:
                    <ul>{options.map(v => <li key={v}>{v}</li>)}</ul>
                    </label>}
                <div className="left-aligned">
                    <label className="radio">
                    <input type="radio" name="access" onChange={handleChange} value="public" checked={form.access==="public"}/> 
                    Public
                    </label>
                    <label className="radio">
                    <input type="radio" name="access" onChange={handleChange} value="protected" checked={form.access==="protected"}/> Protected 
                    </label>
                </div>
                {form.access==="protected" &&
                    <div className="field">
                        <label className="label">Key</label>
                        <input className="input" type="text" name="key" placeholder="Key" onChange={handleChange} value={form.key}/>
                    </div>}
                <button className="button is-link is-light" onClick={handleClearOptions}>Clear options</button>
                <button className="button is-link is-light" onClick={handleCancel}>Cancel</button>
                <button className="button is-link" onClick={handleCreateSession}>Create voting session</button>
        </div>
    )
}

export default CreateNewVote
