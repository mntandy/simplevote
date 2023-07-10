import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { decodeVotingToken, decodeUserToken, verifyTokenFromHeader, getNewVotingToken } from '@/app/utils/token'

export async function GET(request, { params }) {
    let decodedToken = await decodeVotingToken({request,session:params.session,organiser:params.organiser})
    
    if(decodedToken.error)
        return NextResponse.json({ error: decodedToken.error },(decodedToken.status ? { status: decodedToken.status} : null))

    await dbConnect()
    
    const user = await User.findOne({nickname: params.organiser}).select({"sessions": { $elemMatch: { _id: params.session }}})

    if(user!==null && Array.isArray(user.sessions) && user.sessions.length) {
        return NextResponse.json(user.sessions[0])
    }
    return NextResponse.json({error: "Voting session not found"},{status: 400})
}

const updateVote = async (nickname,sessionId,optionId,change) => {   
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
        if (decodedToken.session!==params.session || decodedToken.organiser!== params.organiser)
            return NextResponse.json({ error: 'access-token invalid' },{ status: 401})
    }
    catch(err) {
        console.log(err)
        return NextResponse.json({ error: 'access-token missing' },{ status: 400})
    }

    await dbConnect()

    if(decodedToken.previous!==undefined && decodedToken.previous!==null) {
        if(decodedToken.previous !== id) 
            await updateVote(params.organiser,decodedToken.session,decodedToken.previous,-1)
        else
            return NextResponse.json({info: "You have already voted for this option."})

    }

    await updateVote(params.organiser,decodedToken.session,id,1)
    return NextResponse.json({
        token: getNewVotingToken({...decodedToken, previous: id})
    })
}

export async function DELETE(request, { params }) {
    let decodedToken = await decodeUserToken({request})
    if(decodedToken.error)
        return NextResponse.json({ error: decodedToken.error },(decodedToken.status ? { status: decodedToken.status} : null))

    await dbConnect()

    const user = await User.findById(decodedToken.id)
    if(!user || user.nickname !== params.organiser)
        return NextResponse.json({ error: 'access-token invalid' },{ status: 401})
    
    user.sessions.id(params.session).deleteOne()
    const res = await user.save()
    return NextResponse.json({ok:"Ok"})
}