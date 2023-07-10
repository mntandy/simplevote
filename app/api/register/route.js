import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import bcrypt from 'bcrypt'
import { getNewUserToken } from '@/app/utils/token'

export async function POST(req) {
    const body = await req.json()
    let result = null
    
    await dbConnect()

    const existingUser = await User.find({$or: [{email: body.email},{nickname: body.nickname}]},{_id: 0, password: 0, __v: 0}).exec()
    if(existingUser.length) {
        result = existingUser.reduce((col,next) => {
            if(next.email===body.email)
                return {...col,emailExists: true}
            else if (next.nickname===body.nickname)
                return {...col,nicknameExists: true}
        },{})
    }
    else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        const user = new User({
            email: body.email,
            passwordHash: passwordHash,
            nickname: body.nickname,
        })
        console.log(JSON.stringify(user))
        try {
            result = (await user.save())._doc
            console.log(result)
            const token = getNewUserToken(
                {
                    email: user.email,
                    id: user.id,
                })
            return NextResponse.json({ token, email: user.email, nickname: user.nickname }, {status: 200})
        }
        catch(err) {
            result = {...err}
        }
    }
    return NextResponse.json({result},{status: 400})
}