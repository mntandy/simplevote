'use client'
import { useState, useEffect } from "react"
import { submitNewSession, fetchVotingSessionForCopy } from "@/app/lib/client/apiCalls"
import { tryAndCatch } from "../lib/client/errorHandling"

const CreateNewVote = ({ close, update, organiser, sessionId }) => {

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

    useEffect(() => {
        const fetchSession = async () => {
            const responseBody = await tryAndCatch(fetchVotingSessionForCopy, { organiser, sessionId })
            if (responseBody) {
                setForm({ ...form, description: ("Copy of " + responseBody.description ?? ""), access: responseBody.protected ? "protected" : "", key: responseBody.key ?? "" })
                setOptions([...(new Set(responseBody.options.map(e => e.description))).values()])
            }
        }
        if (organiser && sessionId)
            fetchSession()
    }, [sessionId])

    const optionsAreOk = () => (Array.isArray(options) && !!options.length)

    const handleChange = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }

    const handleAddOptions = () => {
        setOptions([...(new Set([...options, ...form.optionsInput.split("\n").filter(e => e !== "")])).values()])
        setForm({ ...form, optionsInput: "" })
    }

    const handleClearOptions = () => {
        setForm({ ...form, options: [] })
    }

    const handleCancel = () => {
        handleClearOptions()
        close()
    }

    const handleCreateSession = async () => {
        if (!optionsAreOk())
            setOptionsInfo(true)
        else {
            const success = await tryAndCatch(submitNewSession, {
                session: {
                    description: form.description,
                    duration: form.duration,
                    options,
                    protected: (form.access === "protected"),
                    key: form.key
                }
            })
            if (success) {
                setForm(initialForm)
                setOptions([])
                setOptionsInfo(false)
                close()
                update()
            }
        }
    }
    return (
        <div className="extra-padding">
            <label className="label">
                Name
                <input className="input" type="text" name="description" placeholder="Description" onChange={handleChange} value={form.description} />
            </label>
            <label className="label">
                Duration in minutes
                <input className="input" type="number" name="duration" onChange={handleChange} value={form.duration} />
            </label>
            <label className="label">Add options (add multiple at once, separated by new-line)
                <textarea className="textarea has-fixed-size" rows="5" name="optionsInput" onChange={handleChange} value={form.optionsInput}></textarea></label>
            {optionsInfo && <p class="help is-danger">Please add some options by writing them in the textbox and clicking <i>add options</i></p>}
            <button className="button" onClick={handleAddOptions}>Add options</button>
            {optionsAreOk() &&
                <label className="label">Current options
                    <ul>{options.map(v => <li key={v} className="option">{v}</li>)}</ul>
                </label>}
            <label className="label">Status
                <div className="left-aligned">
                <label className="radio">
                    <input type="radio" name="access" onChange={handleChange} value="public" checked={form.access === "public"} />
                    Public
                </label>
                <label className="radio">
                    <input type="radio" name="access" onChange={handleChange} value="protected" checked={form.access === "protected"} /> Protected
                </label>
                </div>
            </label>
            {form.access === "protected" &&
                <label className="label">Key
                    <input className="input" type="text" name="key" placeholder="Key" onChange={handleChange} value={form.key} />
                </label>}
            <button className="button" onClick={handleClearOptions}>Clear options</button>
            <button className="button" onClick={handleCancel}>Cancel</button>
            <button className="button" onClick={handleCreateSession}>Create voting session</button>
        </div>
    )
}

export default CreateNewVote
