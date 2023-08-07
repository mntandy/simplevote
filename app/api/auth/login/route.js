import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/user'
import bcrypt from 'bcrypt'
import { getNewUserToken } from '@/app/utils/token'

export async function POST(req) {
    const { email, password } = await req.json()
    
    if(!email || !password)
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    
    await dbConnect()

    const user = await User.findOne({ email })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!user || !passwordCorrect)
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    const token = getNewUserToken(
        {
            email: user.email,
            id: user.id,
        })

    return NextResponse.json({ token, email: user.email, nickname: user.nickname }, {status: 200})
}