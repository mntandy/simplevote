import { NextResponse } from 'next/server'
import { getVotingSessions, getSessionsIntro } from '@/app/lib/server/votingSessions'

export async function GET(request, { params }) {
    const sessions = await getVotingSessions({organiser:params.organiser})
    const intro = await getSessionsIntro({organiser:params.organiser}) ?? null
    if(sessions!==null) {
        return NextResponse.json({...sessions, intro, nickname: params.organiser })
    }
    return NextResponse.json({error: "User not found"},{status: 400})
}
