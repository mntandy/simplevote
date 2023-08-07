'use client'
 
import { createContext } from 'react'
import useMessage from '@/app/hooks/useMessage'
import useUser from '@/app/hooks/useUser'

export const MessageContext = createContext()
export const UserContext = createContext()

const MessageProvider = ({children}) => {
    const msg = useMessage()
    return (
        <MessageContext.Provider value={msg}>
            {children}
        </MessageContext.Provider>
    )
}

const UserProvider = ({children}) => {
    const user = useUser()
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export default function GlobalProvider({ children }) {
    return (
            <MessageProvider>
                <UserProvider>
                {children}
                </UserProvider>
            </MessageProvider>)
}