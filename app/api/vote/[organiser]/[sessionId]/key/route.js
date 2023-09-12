import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { getNewVotingToken } from '@/app/lib/server/token'
import { getAuthSession } from '@/app/lib/server/authSession'

export async function POST(req,{ params }) {
    const { key } = await req.json()
    
    if(!key)
        return NextResponse.json({ error: 'No key' }, { status: 401 })
    
    await dbConnect()

    const user = await User.findOne({nickname: params.organiser},{ sessions: { $elemMatch: { _id: params.sessionId } } })
    if(!user || !user.sessions.length)
        return NextResponse.json({ error: "session id is invalid"})
        
    const keyCorrect = (!user || !user.sessions.length)
      ? false
      : (key === user.sessions[0].key)

    if (!keyCorrect)
        return NextResponse.json({ error: 'Invalid session or key' }, { status: 401 })
    const token = getNewVotingToken(
        {
            organiser: params.organiser,
            sessionId: params.sessionId,
        })

    return NextResponse.json({ token }, {status: 200})
}