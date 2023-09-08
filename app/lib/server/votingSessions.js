import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'

const splitAt = (arr,index) => (index!==-1 ?
    [arr.slice(0,index), arr.slice(index)] :
    [arr.slice(0),[]])

const transform = (m) => m.map((session) => (
    {
        description:session.description,
        expiration:session.expiration,
        id:session.id.toString()
    }))

const getVotingSessions = async ({ organiser }) => {
    await dbConnect()
    const sessions = await User.aggregate([
        {$unwind: {path: '$sessions'}},
        {$match: {'nickname': organiser}},
        {$project: {
            id: '$sessions._id',
            description: '$sessions.description',
            expiration: '$sessions.expiration'
        }}]).sort({expiration: -1})
    if(sessions===null)
        return sessions
    const now = new Date(Date.now())
    const [ongoing,expired] = splitAt(sessions,sessions.findIndex(e => !("expiration" in e) || now > e.expiration))
    return {ongoing:transform(ongoing),expired:transform(expired)}
}

export { getVotingSessions }
