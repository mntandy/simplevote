import { NextResponse } from 'next/server'
import { verifyToken, getNewVotingToken } from '@/app/utils/token'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import mongoose from 'mongoose'

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id)

export async function GET(request, { params }) {
    if(!isObjectIdValid(params.session))
        return NextResponse.json({ error: "voteid is invalid"})
    try {
        await dbConnect()
        const user = await User.findOne({nickname: params.organiser},{ sessions: {  $elemMatch: {_id: params.session} } })
        if(!user || !user.sessions.length)
            return NextResponse.json({ error: "voteid is invalid"})
        if(user.sessions[0].protected) {
            return NextResponse.json({ protected: true })
        }
        else {
            const token = getNewVotingToken({organiser: params.organiser, session: params.session})
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
            return NextResponse.json({ previousVote: decodedToken.previous }, {status: 200})
        }
        catch(err) {
            console.log(err)
            return NextResponse.json({ error: 'something is wrong with voting token' },{ status: 400})
        }
    }
    return NextResponse.json({ error: 'Server did not receive any voting token' },{ status: 400})
}