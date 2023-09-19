import { NextResponse } from 'next/server'
import { verifyToken, getNewVotingToken } from '@/app/lib/server/token'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import mongoose from 'mongoose'
import { checkAuthSessionForVotingRights } from '@/app/lib/server/votingSession'

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id)

export async function GET(request, { params }) {
    if(!isObjectIdValid(params.sessionId))
        return NextResponse.json({ error: "no such session"})
    try {
        await dbConnect()
        const user = await User.findOne({nickname: params.organiser},{ sessions: {  $elemMatch: {_id: params.sessionId} } })
        if(!user || !user.sessions.length)
            return NextResponse.json({ error: "no user or no session."})
        if(user.sessions[0].protected) {
            const token = await checkAuthSessionForVotingRights({organiser: params.organiser,sessionId: params.sessionId})
            return NextResponse.json((token ? ({ token }) : ({ protected: true })), {status: 200})
        }
        else {
            const token = getNewVotingToken({organiser: params.organiser, sessionId: params.sessionId})
            return NextResponse.json({ token }, {status: 200})
        }
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Could not obtain voting token.' },{ status: 500})
    }    
}

export async function POST(request) {
    const body = await request.json()
    if (body.votingToken) {
        try {
            const decodedToken = await verifyToken(body.votingToken)
            return NextResponse.json({ currentVotes: decodedToken?.currentVotes ?? null }, {status: 200})
        }
        catch(err) {
            console.log(JSON.stringify(err))
            return NextResponse.json({ error: 'something is wrong with voting token' },{ status: 400})
        }
    }
    return NextResponse.json({ error: 'Server did not receive any voting token' },{ status: 400})
}