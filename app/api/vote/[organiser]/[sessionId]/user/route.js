import { NextResponse } from 'next/server'
import { checkAuthSessionForVotingRights } from '@/app/lib/server/votingSession'

export async function GET(request, { params }) {
    const token = checkAuthSessionForVotingRights({organiser:params.organiser, sessionId:params.sessionId})
    return NextResponse.json((token ? { token } : { info: "Voting rights required."}), {status: 200})
}