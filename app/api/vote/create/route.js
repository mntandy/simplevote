import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { getAuthSession } from '@/app/lib/server/authSession'
import errorResponse from '@/app/lib/errorResponse'

export async function POST(request) {
    const body = await request.json()
    try {
        const authSession = await getAuthSession()
        
        if(!authSession)
            return NextResponse.json({ error: "Not logged in"},{ status: 401})

        await dbConnect()

        const user = await User.findById(authSession.user.id)
        if(!user)
            return NextResponse.json({ error: 'Invalid user' },{ status: 401})
    
        await user.sessions.push({
            protected: body.protected,
            key: (body.protected && body.key),
            description: body.description,
            maxVotes: body.maxVotes,
            expiration: ((body.duration && /^\d+$/.test(body.duration)) ? Date.now()+(Number(body.duration)*60000) : null),
            options: body.options.map(o => ({description: o, votes: 0}))
        })
        const res = await user.save()
        return NextResponse.json({ok:"Ok"})
    }
    catch(err) {
        return errorResponse(err)
    }
}

