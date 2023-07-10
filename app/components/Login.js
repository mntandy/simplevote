'use client'
import { useRef } from "react"

export default ({user,toggleNewUser=null}) => {
    const inputEmail = useRef(null)   
    const inputPassword = useRef(null)

    const handleLogin = (event) => {
        user.login({
            email:inputEmail.current.value,
            password:inputPassword.current.value
        })
    }
    return (
        <div className="container">
            <div className="column is-half is-offset-one-quarter">
            <div className="field">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="Email input"
                autoComplete="on" ref={inputEmail}/>
            </div>
            <div className="field">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Password"
                    autoComplete="on" ref={inputPassword}/>
            </div>
        <div className="field is-grouped">
            <div className="control">
                <button className="button is-link" onClick={handleLogin}>Log in</button>
            </div>
            <div className="control">
                <button className="button is-link is-light" onClick={(event) => {}}>Cancel</button>
            </div>
            {toggleNewUser!==null && <div className="control">
                <button className="button is-link is-light" onClick={toggleNewUser}>Register a new user</button>
            </div>}
        </div>
        </div>
    </div>
    )
}