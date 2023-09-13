import Navbar from '@/app/components/Navbar'
import Message from "@/app/components/Message"

const Layout = ( {children}) => {
    return (
        <>
            <Navbar/>
            <div className="centered">
                <div>
                    <Message/>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout