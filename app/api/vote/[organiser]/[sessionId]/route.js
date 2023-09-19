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
        return NextResponse.json({...session._doc,key:undefined,currentVotes:decodedToken?.currentVotes ?? null})
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
    const { id,upvote } = await request.json()
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

    const {expiration,maxVotes} = await getVotingSession({nickname: params.organiser,sessionId:params.sessionId})
    if(expiration && new Date(expiration)<=Date.now())
        return NextResponse.json({error: "Voting session is closed."})

    if(!upvote && decodedToken?.currentVotes && Array.isArray(decodedToken.currentVotes)) {
        const i = decodedToken.currentVotes.indexOf(id)
        if(i>=0) {
            await updateVote(params.organiser,decodedToken.sessionId,id,-1)
            decodedToken.currentVotes.splice(i,1)
        }
        else
            return NextResponse.json({info: "You have to vote before you can unvote."})
            
    }
    else if(upvote) {
        if(decodedToken?.currentVotes && decodedToken.currentVotes.length>=(+maxVotes || decodedToken.currentVotes.length))  
            return NextResponse.json({info: "You're out of votes. Unvote something."})
        else {
            await updateVote(params.organiser,decodedToken.sessionId,id,1)
            if(decodedToken?.currentVotes && Array.isArray(decodedToken.currentVotes)) 
                decodedToken.currentVotes.push(id)
            else
                decodedToken.currentVotes = [id]
        }
    }
    return NextResponse.json({
        token: getNewVotingToken({...decodedToken})
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