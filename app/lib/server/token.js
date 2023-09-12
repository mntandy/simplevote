import jwt from 'jsonwebtoken'

require('dotenv').config()

const getTokenFromHeader = (req) => {
    const authorization = new Headers(req.headers).get('authorization')
    if (authorization && authorization.startsWith('Bearer '))    
        return authorization.replace('Bearer ', '')
    return null
}

const verifyTokenFromHeader = async (req) => {
    return await jwt.verify(getTokenFromHeader(req), process.env.SECRET)
}

const verifyToken = async (token) => {
    return await jwt.verify(token, process.env.SECRET)
}

const getNewVotingToken = (input) => {
    return jwt.sign(
        input,
        process.env.SECRET)
}

const decodeVotingToken = async ({request,sessionId,organiser}) => {
    try {
        const votingToken = await verifyTokenFromHeader(request)
        if (votingToken.sessionId===sessionId && votingToken.organiser===organiser)
            return votingToken
        return { error: 'something is wrong with the voting token.', status: 400}
    }
    catch (err) {
        console.log(err)
        return { error: 'something is wrong with the voting token.', status: 400}
    }
}

export { decodeVotingToken, verifyTokenFromHeader, getNewVotingToken, verifyToken }

