import Link from 'next/link'
import SignOutButton from '@/app/components/SignOutButton'
import { getAuthSession } from '../lib/server/authSession'
import { getClasses, getLogo, getLogoLink } from '../lib/styles'

const Navbar = async ({organiser}) => {
    const session = await getAuthSession()
    return (
    <nav className={getClasses(organiser,"nav")}>
        <div className={getClasses(organiser, "nav-left")}>
        </div>
        <div className={getClasses(organiser,"nav-center")}>
            <a className={getClasses(organiser,"nav-a")} href={getLogoLink(organiser)}>
                <img src={getLogo(organiser)} height="50" alt="Logo"/>
            </a>
        </div>
        <div className={getClasses(organiser,"nav-right")}>
            {session ? 
                <SignOutButton organiser={organiser}/> :
                <Link className={getClasses(organiser,"nav-a")} href="/admin"> Admin</Link>}
        </div>
    </nav>)
}

export default Navbar