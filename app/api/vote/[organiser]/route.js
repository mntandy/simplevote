import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/user'

const splitAt = (arr,index) => (index!==-1 ?
    [arr.slice(0,index), arr.slice(index)] :
    [arr.slice(0),[]])

export async function GET(request, { params }) {
    await dbConnect()
    const sessions = await User.aggregate([
        {$unwind: {path: '$sessions'}},
        {$match: {'nickname': params.organiser}},
        {$project: {
            id: '$sessions._id',
            description: '$sessions.description',
            expiration: '$sessions.expiration'
        }}]).sort({expiration: -1})
    const now = new Date(Date.now())
    console.log(now)
    console.log(sessions)
    console.log(sessions.findIndex(e => !("expiration" in e) || now > e.expiration))
    const [ongoing,expired] = splitAt(sessions,sessions.findIndex(e => !("expiration" in e) || now > e.expiration))
    if(sessions!==null) 
        return NextResponse.json({ ongoing,expired, nickname: params.organiser })
    return NextResponse.json({error: "User not found"},{status: 400})
}
