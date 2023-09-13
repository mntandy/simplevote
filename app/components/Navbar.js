import Link from 'next/link'
import SignOutButton from '@/app/components/SignOutButton'
import { getAuthSession } from '../lib/server/authSession'
import '@/app/css/Navbar.css'

const Navbar = async () => {
    const session = await getAuthSession()
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
            {session ? 
                <SignOutButton/> :
                <Link className="nav-a" href="/admin"> Admin</Link>}
        </div>
    </nav>)
}

export default Navbar