import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import bcrypt from 'bcrypt'
import { getNewUserToken } from '@/app/utils/token'
import errorResponse from '@/app/lib/errorResponse'

export async function POST(req) {
    const body = await req.json()
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
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        const user = new User({
            email: body.email,
            passwordHash: passwordHash,
            nickname: body.nickname,
        })
        try {
            result = (await user.save())._doc
            const token = getNewUserToken(
                {
                    email: user.email,
                    id: user.id,
                })
            return NextResponse.json({ token, email: user.email, nickname: user.nickname }, {status: 200})
        }
        catch(err) {
            console.log(err)
            return errorResponse(err)
        }
    }
}