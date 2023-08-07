'use client'
import { useRef, useContext } from "react"
import { UserContext } from '@/app/contexts'

const Login = ({toggleNewUser=null}) => {
    const inputEmail = useRef(null)   
    const inputPassword = useRef(null)
    const user = useContext(UserContext)

    const handleLogin = () => {
        user.login({
            email:inputEmail.current.value,
            password:inputPassword.current.value
        })
    }
    return (
        <div className="container">
            <div>
            <label>
                Email
                <input type="email" placeholder="Email"
                autoComplete="on" ref={inputEmail}/>
            </label>
            <label>
                Password
                <input type="password" placeholder="Password"
                    autoComplete="on" ref={inputPassword}/>
            </label>
            <div className="right-aligned small-width">
            <button className="button" onClick={handleLogin}>Log in</button>
            </div>
            {toggleNewUser!==null &&
                <button className="button is-link is-light" onClick={toggleNewUser}>Register a new user</button>}
            </div>
        </div>
    )
}

export default Login