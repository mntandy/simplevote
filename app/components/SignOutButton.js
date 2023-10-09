'use client'
import { signOut } from "next-auth/react"
import Link from 'next/link'
import { getClasses } from "../lib/styles"

const SignOutButton = ({organiser}) => {
    return (<Link className={getClasses(organiser,"nav-a")} href={"/" + organiser} onClick={signOut}> Log out </Link>)
}

export default SignOutButton