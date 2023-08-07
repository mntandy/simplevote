'use client'
import { useState, useContext } from "react"
import { MessageContext } from '@/app/contexts'

export default function Register() {
    const msg = useContext(MessageContext)
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')   
    const [password, setPassword] = useState('')
    const [retypepassword, setRetypePassword] = useState('')
    const [emailError,setEmailError] = useState(null)
    const [nicknameError,setNicknameError] = useState(null)
    const [passwordError,setPasswordError] = useState(null)
    
    const reset = () => {
        setEmail('')
        setPassword('')
        setNickname('')
    }

    const handleRegister = async (event) => {
        if(nickname==="")
            setNicknameError("This cannot be empty.")
        if(email==="")
            setEmailError("This cannot be empty.")
        if(nickname!=="" && email!=="" && password===retypepassword) {
            try {
                const result = await fetch('/api/register/', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({nickname,email,password}),})
                const body = await result.json()
                if(body.emailExists) setEmailError("This email is already in use")
                if(body.nicknameExists) setNicknameError("This username is unavailable")
                if(!body.emailExists && !body.nicknameExists &&
                    body.email && body.nickname) {
                    msg.setSucess("Registration of " + body.email + " with nickname " + body.nickname + " was successful!")
                    reset()
                }
            }
            catch (exception) {
                console.log(exception)
                msg.setError("Error registering user.")
            }
        }
    }
    return (
        <div>
            <div className="field">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="Email input"
                    onChange={({ target }) => setEmail(target.value)} value={email}
                    onClick={(event) => setEmailError(null)}/>
                {emailError && <p className="help is-danger">{emailError}</p>}
            </div>
            <div className="field">
                <label className="label">Password</label>
                <input className="input" type="password" value={password} placeholder="Password"
                    onChange={({ target }) => setPassword(target.value)}
                    onClick={(event) =>  setPasswordError(null)}/>
                {passwordError && <p className="help is-danger">{passwordError}</p>}
            </div>
            <div className="field">
                <label className="label">Retype password</label>
                <input className="input" type="password" value={retypepassword} placeholder="Password"
                    onChange={({ target }) => setRetypePassword(target.value)}/>
                {password!==retypepassword && <p className="help is-danger">Passwords do not match.</p>}
            </div>
            <div className="field">
                <label className="label">Nickname</label>
                <input className="input" type="text" placeholder="Nickname" value={nickname}
                    onChange={({ target }) => setNickname(target.value)}
                    onClick={(event) => setNicknameError(null)}/>
                {nicknameError && <p className="help is-danger">{nicknameError}</p>}
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button className="button is-link" onClick={handleRegister}>Register</button>
                </div>
                <div className="control">
                    <button className="button is-link is-light" onClick={reset}>Cancel</button>
                </div>
            </div>
        </div>
    )
}