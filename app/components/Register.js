'use client'
import { useState } from "react"

export default function Register({user,toggleNewUser,msg}) {
    const [nickname, setNickname] = useState('a')
    const [email, setEmail] = useState('a@a.a')   
    const [password, setPassword] = useState('')
    const [retypepassword, setRetypePassword] = useState('')
    const [emailError,setEmailError] = useState(null)
    const [nicknameError,setNicknameError] = useState(null)
    const [passwordError,setPasswordError] = useState(null)
    
    const handleRegister = async (event) => {
        if(nickname==="") {
            setNicknameError("This cannot be empty.")
            console.log("set")
        }
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
                    msg.set("is-success","Registration of " + body.email + " with nickname " + body.nickname + " was successful!")
                    user.set(body)
                    setEmail('')
                    setPassword('')
                    setNickname('')
                }
            }
            catch (exception) {
                msg.setError("Error registering user.")
            }
        }
    }
    return (
        <div className="container">
            <div className="column is-half is-offset-one-quarter">
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
                <button className="button is-link is-light" onClick={toggleNewUser}>Cancel</button>
            </div>
        </div>
        </div>
    </div>
    )
}