import jwt from 'jsonwebtoken'
import { headers } from 'next/headers'

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

const getNewUserToken = (input) => {
    return jwt.sign(
        input,
        process.env.SECRET,
        { expiresIn: 60 })
}

const getNewVotingToken = (input) => {
    return jwt.sign(
        input,
        process.env.SECRET)
}

const decodeUserToken = async ({request}) => {
    try {
        return await verifyTokenFromHeader(request) 
    }
    catch(err) {
        return { error: 'access-token missing from header', status: 400}
    }
}

const decodeVotingToken = async ({request,session,organiser}) => {
    try {
        const votingToken = await verifyTokenFromHeader(request)
        if (votingToken.session===session && votingToken.organiser===organiser)
            return votingToken
        return { error: 'something is wrong with the voting token.', status: 400}
    }
    catch(err) {
        return { error: 'voting token missing', status: 400}
    }
}

export { decodeVotingToken, verifyTokenFromHeader, decodeUserToken, getNewUserToken, getNewVotingToken, verifyToken }

