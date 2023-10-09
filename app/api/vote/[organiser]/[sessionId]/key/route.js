import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { getNewVotingToken } from '@/app/lib/server/token'
import { containsNonEmptyArray } from '@/app/lib/basicutils'
import errorResponse from '@/app/lib/errorResponse'

export async function POST(req, { params }) {
    try {
        const { key } = await req.json()

        await dbConnect()

        const user = await User.findOne({ nickname: params.organiser }, { sessions: { $elemMatch: { _id: params.sessionId } } })

        return (user && containsNonEmptyArray(user, "sessions") && (key === user.sessions[0].key)) ?
            NextResponse.json({
                token: getNewVotingToken(
                    {
                        organiser: params.organiser,
                        sessionId: params.sessionId,
                    })
            }, { status: 200 })
            : NextResponse.json({ error: 'Invalid session or key' }, { status: 401 })
    }
    catch (err) {
        return errorResponse(err)
    }
}