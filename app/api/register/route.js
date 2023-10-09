import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import bcrypt from 'bcrypt'
import errorResponse from '@/app/lib/errorResponse'

export async function POST(request) {

    const body = await request.json()
    let result = null
    
    await dbConnect()

    const existingUser = await User.find({$or: [{email: body.email},{nickname: body.nickname}]},{_id: 0, password: 0, __v: 0}).exec()
    if(existingUser.length) {
        return NextResponse.json(
            existingUser.reduce((col,next) => 
            (next.email===body.email) 
            ? ({...col,emailExists: true}) 
            : ((next.nickname===body.nickname)
            ? ({...col,nicknameExists: true})
            : col)
            ,{}), {status: 400})
    }
    else {
        const user = new User({
            email: body.email,
            passwordHash: await bcrypt.hash(body.password, 10),
            nickname: body.nickname,
        })
        try {
            result = (await user.save())._doc
            return NextResponse.json({ email: user.email, nickname: user.nickname }, {status: 200})
        }
        catch (err) {
            return errorResponse(err)
        }
    }
}