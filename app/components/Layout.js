'use client'

import AdminNavbar from '@/app/components/AdminNavbar'
import Message from "@/app/components/Message"

const Layout = ( {children,organiser=null,user=null}) => {
    return (
        <div>
            {<AdminNavbar/>}
            <Message/>
            <div className="centered">
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout