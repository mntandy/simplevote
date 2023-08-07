'use client'
import { useContext } from 'react'
import { UserContext } from '@/app/contexts'

const AdminNavbar = () => {
    const user = useContext(UserContext)
    
    return (
    <nav>
        <div className="nav-left">
        </div>
        <div className="nav-center">
            <a className="nav-a" href="https://www.jammin.no">
                <img src="/Jammin+Liten.jpg" height="50" alt="Logo"/>
            </a>
        </div>
        <div className="nav-right">
            {user.token ? 
                <a className="nav-a" href={'/admin'} onClick={user.logout}> Log out </a> :
                <a className="nav-a" href={'/admin'}> Admin</a>}
        </div>
    </nav>)
}

export default AdminNavbar