'use client'
import { signOut } from "next-auth/react"
import Link from 'next/link'

const SignOutButton = () => {
    return (<Link className="nav-a" href="/admin" onClick={signOut}> Log out </Link>)
}

export default SignOutButton