import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'

import { getAuthSession } from '@/app/lib/server/authSession'
import { getNewVotingToken } from '@/app/lib/server/token'

export const getSessionKey = async ({ sessionId }) => {
    const authSession = await getAuthSession()
    if (authSession) {
        await dbConnect()
        const user = await User.findById(authSession.user.id).select({ "sessions": { $elemMatch: { _id: sessionId } } })
        return (
            (Array.isArray(user?.sessions)
                && user.sessions.at(0)?.protected
                && user.sessions.at(0)?.key)
            ?? null)
    }
    return null
}

export const checkAuthSessionForVotingRights = async ({ organiser, sessionId }) => {
    const authSession = await getAuthSession()
    if (authSession) {
        await dbConnect()
        const user = await User.findOne({ _id: authSession.user.id })
        if (user && user.nickname === organiser) {
            const newToken = getNewVotingToken({ organiser, sessionId })
            return newToken
        }
    }
    return null
}

export const checkAuthSessionForAccess = async ({ organiser, sessionId }) => {
    const authSession = await getAuthSession()
    if (authSession) {
        await dbConnect()
        const user = await User.findOne({ _id: authSession.user.id })
        if (user && user.nickname === organiser) {
            return true
        }
    }
    return false
}