import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { decodeVotingToken, verifyTokenFromHeader, getNewVotingToken } from '@/app/lib/server/token'
import errorResponse from '@/app/lib/errorResponse'
import { getAuthSession } from '@/app/lib/server/authSession'

const getVotingSession = async ({nickname,sessionId}) => {
    await dbConnect()
    
    const user = await User.findOne({nickname}).select({"sessions": { $elemMatch: { _id: sessionId }}})

    if(user!==null && Array.isArray(user.sessions) && user.sessions.length)
        return user.sessions[0]
    else return null
}

export async function GET(request, { params }) {
    let decodedToken = await decodeVotingToken({request,sessionId:params.sessionId,organiser:params.organiser})
    
    if(decodedToken.error)
        return NextResponse.json({ error: decodedToken.error },(decodedToken.status ? { status: decodedToken.status} : null))

    const session = await getVotingSession({nickname:params.organiser,sessionId:params.sessionId})
    if(session) {
        console.log(decodedToken?.previous)
        session.options.sort((a,b)=> a.votes<b.votes ? 1 : (a.votes>b.votes ? -1 : 0))
        return NextResponse.json({...session._doc,key:undefined,previousVote:decodedToken?.previous ?? null})
    }
    return NextResponse.json({error: "Voting session not found"},{status: 400})
}

const updateVote = async (nickname,sessionId,optionId,change) => {
    await dbConnect()
   
    const res = await User.updateOne({ nickname },
    {
        $inc: {

            'sessions.$[i].options.$[j].votes': change
        }
    },
    {
        arrayFilters: [
            {
                "i._id": sessionId
             },
            { 
                "j._id": optionId 
            }]
    })
}

export async function POST(request, { params }) {
    const { id } = await request.json()
    let decodedToken = null
    try {
        decodedToken = await verifyTokenFromHeader(request)
        if (decodedToken.sessionId!==params.sessionId || decodedToken.organiser!== params.organiser)
            return NextResponse.json({ error: 'access-token invalid' },{ status: 401})
    }
    catch(err) {
        console.log(err)
        return NextResponse.json({ error: 'access-token missing' },{ status: 400})
    }

    const {expiration} = await getVotingSession({nickname: params.organiser,sessionId:params.sessionId})
    if(expiration && new Date(expiration)<=Date.now())
        return NextResponse.json({error: "Voting session is closed."})

    if(decodedToken.previous!==undefined && decodedToken.previous!==null) {
        if(decodedToken.previous !== id) 
            await updateVote(params.organiser,decodedToken.sessionId,decodedToken.previous,-1)
        else
            return NextResponse.json({info: "You have already voted for this option."})

    }

    await updateVote(params.organiser,decodedToken.sessionId,id,1)
    return NextResponse.json({
        token: getNewVotingToken({...decodedToken, previous: id})
    })
}

export async function DELETE(request, { params }) {
    try {
        const session = await getAuthSession()
        await dbConnect()
        const user = await User.findById(session.user.id)
        if(!user || user.nickname !== params.organiser)
            return NextResponse.json({ error: 'access-token invalid' },{ status: 401})
    
        user.sessions.id(params.sessionId).deleteOne()
        const res = await user.save()
        return NextResponse.json({ok:"Ok"})
    }
    catch(err) {
        return errorResponse(err)
    }
}