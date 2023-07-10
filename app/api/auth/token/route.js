import { NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/token'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/user'

export async function POST(req) {
    const { token } = await req.json()
    
    try {
        const decodedToken = await verifyToken(token)
    
        await dbConnect()

        const user = await User.findOne({ email:decodedToken.email })
        if (!user)
            return NextResponse.json({ error: 'Invalid user token' }, { status: 401 })
        return NextResponse.json({ token, email: user.email, nickname: user.nickname }, {status: 200})
    }
    catch (err) {
        console.log(JSON.stringify(err))

        switch(err.name) {
            case "TokenExpiredError": return NextResponse.json({ expired: true }, { status: 200 })
            default: return NextResponse.json({ error: "Something went wrong with the user token." }, { status: 400 })
        }
    }
}