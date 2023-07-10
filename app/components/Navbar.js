import 'bulma/css/bulma.min.css'

const Navbar = () => {
    return (
    <div className="column is-half is-offset-one-quarter">
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href="/">
            <img src="/musical-notes-outline.svg" width="112" height="28"/>
            </a>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="navbarBasic" className="navbar-menu">
        <div className="navbar-start">
            <a href="/" className="navbar-item"> Home</a>
            <a href="/administration/" className="navbar-item"> Adminstration</a>
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link"> More</a>
                <div className="navbar-dropdown">
                    <a className="navbar-item"> About</a>
                    <a href="mailto:afjellstad@gmail.com" className="navbar-item"> Contact</a>
                    <hr className="navbar-divider"/>
                    <a href="mailto:afjellstad@gmail.com" className="navbar-item"> Report an issue </a>
                </div>
            </div>
        </div>
        </div>
    </nav>
    </div>)
}

export default Navbar