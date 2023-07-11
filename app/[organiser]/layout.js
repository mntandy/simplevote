import AdminNavbar from "@/app/components/AdminNavbar"

const Layout = ({ children,params }) => {
    return (
    <div className="container">
        <AdminNavbar/>
        <div className="columns is-mobile is-centered">
        <div className="column is-narrow">
            <div className="box">
                {children}
            </div>
        </div>
        </div>
    </div>)
}

export default Layout