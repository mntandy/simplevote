import { NextResponse } from 'next/server'
import { verifyToken, getNewVotingToken } from '@/app/lib/server/token'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import mongoose from 'mongoose'
import { checkAuthSessionForVotingRights } from '@/app/lib/server/votingSession'
import { containsNonEmptyArray } from '@/app/lib/basicutils'
import errorResponse from '@/app/lib/errorResponse'

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id)

export async function GET(request, { params }) {
    if (!isObjectIdValid(params.sessionId))
        return NextResponse.json({ error: "no such session" })
    try {
        await dbConnect()
        const user = await User.findOne({ nickname: params.organiser }, { sessions: { $elemMatch: { _id: params.sessionId } } })
        if (user && containsNonEmptyArray(user, "sessions")) {
            if (user.sessions[0].protected) {
                const token = await checkAuthSessionForVotingRights({ organiser: params.organiser, sessionId: params.sessionId })
                return NextResponse.json((token ? ({ token }) : ({ protected: true })), { status: 200 })
            }
            else {
                const token = getNewVotingToken({ organiser: params.organiser, sessionId: params.sessionId })
                return NextResponse.json({ token }, { status: 200 })
            }
        }
        else
            return NextResponse.json({ error: "no user or no session." })

    }
    catch (err) {
        return errorResponse(err)
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        if (body.votingToken) {
            const decodedToken = await verifyToken(body.votingToken)
            return NextResponse.json({ currentVotes: decodedToken?.currentVotes ?? null }, { status: 200 })
        }
        else
            return NextResponse.json({ error: 'Server did not receive any voting token' }, { status: 400 })
    }
    catch (err) {
            return errorResponse(err)
    }
}