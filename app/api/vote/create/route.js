import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { decodeUserToken } from '@/app/utils/token'
import errorResponse from '@/app/lib/errorResponse'

export async function POST(request) {
    const body = await request.json()
    try {
        const decodedToken = await decodeUserToken({request})
        if(decodedToken.error)
            return NextResponse.json({ error: decodedToken.error },(decodedToken.status ? { status: decodedToken.status} : null))

        await dbConnect()

        const user = await User.findById(decodedToken.id)
        if(!user)
            return NextResponse.json({ error: 'access-token invalid' },{ status: 401})
    
        await user.sessions.push({
            protected: body.protected,
            key: (body.protected && body.key),
            description: body.description,
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

