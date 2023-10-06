import { NextResponse } from 'next/server'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import { decodeVotingToken, verifyToken, getNewVotingToken, getTokenFromHeader } from '@/app/lib/server/token'
import errorResponse from '@/app/lib/errorResponse'
import { getAuthSession } from '@/app/lib/server/authSession'
import { containsArray, containsNonEmptyArray } from '@/app/lib/basicutils'

let voteLock = new Set()

const getVotingSession = async ({ nickname, sessionId }) => {
    await dbConnect()

    const user = await User.findOne({ nickname }).select({ "sessions": { $elemMatch: { _id: sessionId } } })
    return containsNonEmptyArray(user,"sessions") ? user.sessions[0] : null
}

export async function GET(request, { params }) {
    let decodedToken = await decodeVotingToken({ request, sessionId: params.sessionId, organiser: params.organiser })

    if (decodedToken.error)
        return NextResponse.json({ error: decodedToken.error }, (decodedToken.status ? { status: decodedToken.status } : null))
    const session = await getVotingSession({ nickname: params.organiser, sessionId: params.sessionId })
    if (session) {
        return NextResponse.json({ ...session._doc, key: undefined, currentVotes: decodedToken?.currentVotes ?? null })
    }
    return NextResponse.json({ error: "Voting session not found" }, { status: 400 })
}

const updateVote = async (nickname, sessionId, optionId, change) => {
    await dbConnect()

    const res = await User.updateOne({ nickname },
        {
            $inc: {

                'sessions.$[i].options.$[j].votes': change
            }
        },
        {
            arrayFilters: [
                {
                    "i._id": sessionId
                },
                {
                    "j._id": optionId
                }]
        })
}

export async function POST(request, { params }) {
    const response = {}
    const token = getTokenFromHeader(request)
    if (token) {
        try {
            const { id, upvote } = await request.json()

            if (voteLock.has(token))
                response["info"] = "multiFirst"
            else {
                voteLock.add(token)

                const decodedToken = await verifyToken(token)
                if (decodedToken.sessionId !== params.sessionId || decodedToken.organiser !== params.organiser)
                    response["error"] = 'access-token invalid'
                else {
                    const { expiration, maxVotes } = await getVotingSession({ nickname: params.organiser, sessionId: params.sessionId })
                    if (expiration && new Date(expiration) <= Date.now())
                        response["info"] = "voteClosed"
                    else {
                        if (!upvote && containsArray(decodedToken,"currentVotes")) {
                            const i = decodedToken.currentVotes.indexOf(id)
                            if (i < 0) 
                                response["info"] = "voteFirst"
                            else {
                                await updateVote(params.organiser, decodedToken.sessionId, id, -1)
                                decodedToken.currentVotes.splice(i, 1)
                                response["token"] = getNewVotingToken({ ...decodedToken })
                            }
                        }
                        else if (upvote) {
                            if (containsArray(decodedToken,"currentVotes") && decodedToken.currentVotes.length >= (+maxVotes || decodedToken.currentVotes.length))
                                response["info"] = "voteOut"
                            else {
                                await updateVote(params.organiser, decodedToken.sessionId, id, 1)
                                if (containsArray(decodedToken,"currentVotes"))
                                    decodedToken.currentVotes.push(id)
                                else
                                    decodedToken.currentVotes = [id]
                                response["token"] = getNewVotingToken({ ...decodedToken })
                            }
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
            response["error"] = 'Something went very wrong with the vote.'
        }
        voteLock.delete(token)
    }
    else
        response["error"] = "No token."

    if (Object.hasOwn(response,"error"))
        return NextResponse.json(response, { status: 400 })
    else
        return NextResponse.json(response)
}

export async function DELETE(request, { params }) {
    try {
        const session = await getAuthSession()
        await dbConnect()
        const user = await User.findById(session.user.id)
        if (!user || user.nickname !== params.organiser)
            return NextResponse.json({ error: 'access-token invalid' }, { status: 401 })

        user.sessions.id(params.sessionId).deleteOne()
        const res = await user.save()
        return NextResponse.json({ ok: "Ok" })
    }
    catch (err) {
        return errorResponse(err)
    }
}