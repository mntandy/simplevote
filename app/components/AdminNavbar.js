import 'bulma/css/bulma.min.css'

export default function AdminNavbar ({ user={} }) {
    return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href={`/${user.nickname || ""}`}>
            <img src="/musical-notes-outline.svg" alt="A musical note" width="112" height="28"/>
            </a>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarAdmin">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="navbarAdmin" className="navbar-menu">
        <div className="navbar-end">
            {user.ok ? 
                <a onClick={user.logout} href={`/admin/`} className="navbar-item"> Log out</a> :
                <a href={`/admin/`} className="navbar-item"> Admin</a>}
        </div>
        </div>
    </nav>)
}
