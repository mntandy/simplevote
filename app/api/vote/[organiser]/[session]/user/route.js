import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { verifyToken, getNewVotingToken } from '@/app/utils/token'

export async function POST(request, { params }) {
    const body = await request.json()
    if(body.userToken) {
        try {
            const decodedToken = await verifyToken(body.userToken)
            await dbConnect()
            const user = await User.findOne({ _id: decodedToken.id })
            if(user && user.nickname === params.organiser) {
                const token = getNewVotingToken({organiser: params.organiser, session: params.session})
                return NextResponse.json({ token }, {status: 200})
            }
            return NextResponse.json({ error: "user token not sufficient for voting rights." }, {status: 401})
        }
        catch(err) {
            console.log(err)
            return NextResponse.json({ error: 'something is wrong with user token.' },{ status: 400})
        }
    }
    return NextResponse.json({ error: 'no user token.' },{ status: 400})    
}