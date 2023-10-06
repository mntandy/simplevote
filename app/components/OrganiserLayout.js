import Navbar from '@/app/components/Navbar'
import Message from "@/app/components/Message"
import { getClasses } from '../lib/styles'

const OrganiserLayout = ({ organiser, children }) => {
    return (
        <body className={getClasses(organiser,"body")}>
            <Navbar organiser={organiser} />
            <div className="center-aligned-flex column centered">
                <Message organiser={organiser} />
                {children}
            </div>
        </body>
    )
}

export default OrganiserLayout