import { NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/token'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import errorResponse from '@/app/lib/errorResponse'

export async function POST(req) {
    const { token } = await req.json()
    
    try {
        const decodedToken = await verifyToken(token)
    
        await dbConnect()

        const user = await User.findOne({ email:decodedToken.email })
        if (!user)
            return NextResponse.json({ invalid: true }, { status: 400 })
        return NextResponse.json({ token, email: user.email, nickname: user.nickname }, {status: 200})
    }
    catch (err) {
        console.log(err)
        return errorResponse(err)
    }
}