import { NextResponse } from 'next/server'
import { getVotingSessions } from '@/app/lib/server/votingSessions'

export async function GET(request, { params }) {
    const sessions = await getVotingSessions({organiser:params.organiser})
    if(sessions) {
        return NextResponse.json({...sessions, nickname: params.organiser })
    }
    return NextResponse.json({error: "User not found"},{status: 400})
}
