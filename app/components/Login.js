'use client'
import { useRef, useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"


const Login = ({toggleNewUser=null}) => {
    const inputEmail = useRef(null)   
    const inputPassword = useRef(null)
    const router = useRouter()
    const [loginError,setLoginError] = useState(null)
    const resetLoginError = () => setLoginError(null)

    const handleLogin = async () => {
        const result = await signIn("credentials",
            { 
                redirect:false, 
                email:inputEmail.current.value,
                password:inputPassword.current.value
            })
        if(result.error)
            setLoginError("Error with credentials.")
        else {
            const authSession = await getSession()
            router.push("/" + authSession.user.nickname)
        }
    }
    return (
        <div className="common-container standard-container">
            <div>
            <label>
                Email
                <input type="email" onClick={resetLoginError} placeholder="Email"
                autoComplete="on" ref={inputEmail}/>
            </label>
            <label>
                Password
                <input type="password" onClick={resetLoginError} placeholder="Password"
                    autoComplete="on" ref={inputPassword}/>
            </label>
            <div className="right-aligned small-width">
            <button className="button" onClick={handleLogin}>Log in</button>
            </div>
            <div>
            {loginError && <p className="error">{loginError}</p>}
            </div>
            {toggleNewUser &&
                <button className="button is-link is-light" onClick={toggleNewUser}>Register a new user</button>}
            </div>
            
        </div>
    )
}

export default Login