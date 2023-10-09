import jwt from 'jsonwebtoken'

require('dotenv').config()

const getTokenFromHeader = (req) => {
    const authorization = new Headers(req.headers).get('authorization')
    if (authorization && authorization.startsWith('Bearer '))
        return authorization.replace('Bearer ', '')
    return null
}

const verifyTokenFromHeader = (req) => {
    return jwt.verify(getTokenFromHeader(req), process.env.SECRET)
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET)
}

const getNewVotingToken = (input) =>
    jwt.sign(
        input,
        process.env.SECRET)

const decodeVotingToken = ({ request, sessionId, organiser }) => {
    const votingToken = verifyTokenFromHeader(request)
    if (votingToken.sessionId === sessionId && votingToken.organiser === organiser)
        return votingToken
    return null
}

export { getTokenFromHeader, decodeVotingToken, verifyTokenFromHeader, getNewVotingToken, verifyToken }

