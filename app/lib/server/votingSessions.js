import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'

const splitAt = (arr, index) => (index !== -1 ?
    [arr.slice(0, index), arr.slice(index)] :
    [arr, []])

const transform = (m) => m.map((session) => (
    {
        description: session.description,
        expiration: session.expiration,
        id: session.id.toString()
    }))

const getVotingSessions = async ({ organiser }) => {
    await dbConnect()
    const sessions = await User.aggregate([
        { $unwind: { path: '$sessions' } },
        { $match: { 'nickname': organiser } },
        {
            $project: {
                id: '$sessions._id',
                description: '$sessions.description',
                expiration: '$sessions.expiration'
            }
        }])
    if (sessions === null)
        return sessions
    sessions.sort((a, b) =>
        (!b.expiration)
            ? 1 : (!a.expiration)
                ? -1 : (a.expiration > b.expiration)
                    ? -1 : (a.expiration < b.expiration)
                        ? 1 : 0)
    
    const now = new Date(Date.now())
    const [ongoing, expired] = splitAt(sessions, sessions.findIndex(e => e.expiration && now > e.expiration))
    return { ongoing: transform(ongoing), expired: transform(expired) }
}

export { getVotingSessions }
