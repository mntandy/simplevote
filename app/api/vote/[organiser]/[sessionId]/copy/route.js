import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { checkAuthSessionForAccess } from '@/app/lib/server/votingSession'
import { containsNonEmptyArray } from '@/app/lib/basicutils'

const getVotingSession = async ({nickname,sessionId}) => {
    await dbConnect()
    
    const user = await User.findOne({nickname}).select({"sessions": { $elemMatch: { _id: sessionId }}})

    if(user && containsNonEmptyArray(user,"sessions"))
        return user.sessions[0]
    else return null
}

export async function GET(request, { params }) {
    if(!checkAuthSessionForAccess({organiser:params.organiser,sessionId:params.sessionId}))
        return NextResponse.json({ error: "No access to copy session."})

    const session = await getVotingSession({nickname:params.organiser,sessionId:params.sessionId})
    if(session) {
        return NextResponse.json(session)
    }
    return NextResponse.json({error: "Voting session not found"},{status: 400})
}