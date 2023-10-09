
const areExpectedPropertiesPresent = (body, expectedProperties) =>
    expectedProperties.some(
        property =>
            (property instanceof String && !Object.hasOwn(body, property))
            ||
            (Array.isArray(property) && (!(property.some(e => Object.hasOwn(body, e))))))

const checkResponseForErrors = ({ responseBody, additionalTest = {}, expectedProperties }) => {
    if (responseBody.tokenExpired || responseBody.tokenInvalid)
        throw new Error("Token is expired or invalid.")
    else if (responseBody.error)
        throw new Error(responseBody.error)
    else if (Array.isArray(expectedProperties)
        && areExpectedPropertiesPresent(responseBody, expectedProperties))
        throw new Error("The response from the server was not as expected.")
    else if ("func" in additionalTest && !additionalTest.func(responseBody))
        throw new Error("error" in additionalTest && additionalTest.error)
}

const headerWithOrWithoutToken = (token) =>
    token ?
        ({
            'authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        })
        : ({
            'Content-Type': 'application/json',
        })

export const fetchVotingRightsWithKey = async ({ organiser, sessionId }) => {
    const response = await fetch(`/api/vote/${organiser}/${sessionId}/token`)
    const responseBody = await response.json()
    checkResponseForErrors({
        responseBody,
        expectedProperties: [["protected", "token"]]
    })
    return responseBody
}

export const fetchVotingTokenWithKey = async ({ organiser, sessionId, key }) => {
    const response = await fetch(`/api/vote/${organiser}/${sessionId}/key`, {
        method: 'POST',
        body: JSON.stringify({ key })
    })
    const responseBody = await response.json()
    checkResponseForErrors({
        responseBody,
        expectedProperties: ["token"]
    })
    return responseBody.token
}

export const fetchVotingSession = async ({ organiser, sessionId, token }) => {
    const response = await fetch(`/api/vote/${organiser}/${sessionId}`, {
        method: 'GET',
        headers: headerWithOrWithoutToken(token)
    })
    const responseBody = await response.json()
    checkResponseForErrors({
        responseBody,
        expectedProperties: ["description", "options"]
    })
    return responseBody
}

export const fetchVotingSessionForCopy = async ({ organiser, sessionId }) => {
    const response = await fetch(`/api/vote/${organiser}/${sessionId}/copy`)
    const responseBody = await response.json()
    checkResponseForErrors({
        responseBody,
        expectedProperties: ["description", "options"]
    })
    return responseBody
}

export const postVote = async ({ organiser, sessionId, token, id, upvote }) => {
    const response = await fetch(`/api/vote/${organiser}/${sessionId}`, {
        method: 'POST',
        headers: headerWithOrWithoutToken(token),
        body: JSON.stringify({ token, id, upvote })
    })
    const responseBody = await response.json()
    checkResponseForErrors({
        responseBody,
        expectedProperties: [["info", "token"]]
    })
    if (responseBody.info)
        return { info: responseBody.info, token }
    else
        return { token: responseBody.token }
}

export const fetchVotingTokenWithAuth = async () => {
    const response = await fetch(`/api/vote/${organiser}/${sessionId}/user`)
    const responseBody = await response.json()
    return responseBody?.token ? responseBody.token : null
}

export const submitNewSession = async ({ session }) => {
    const response = await fetch(`/api/vote/create`, {
        method: 'POST',
        body: JSON.stringify(session)
    })
    const responseBody = await response.json()
    checkResponseForErrors({ responseBody })
    return responseBody
}
export const fetchVotingSessions = async ({ organiser }) => {
    const response = await fetch(`/api/vote/${organiser}`, {
        method: 'GET',
    })
    const responseBody = await response.json()
    checkResponseForErrors(
        {
            responseBody,
            additionalTest: {
                func: (body) => (body.nickname === organiser && Array.isArray(body.ongoing) && Array.isArray(body.expired)),
                error: "Bad data received from server."
            },
            expectedProperties: ["ongoing", "expired", "nickname"]
        })
    return { ongoing: responseBody.ongoing, expired: responseBody.expired }
}

export const deleteVotingSession = async ({ organiser, id }) => {
    const response = await fetch(`/api/vote/${organiser}/${id}`, {
        method: 'DELETE'
    })
    const responseBody = await response.json()
    checkResponseForErrors({ responseBody })
    return true
}
