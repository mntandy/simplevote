import Navbar from '@/app/components/Navbar'
import Message from "@/app/components/Message"

const Layout = ( {children}) => {
    return (
        <>
            <Navbar/>
            <div className="centered twentypxmargins">
                <div>
                    <Message/>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout