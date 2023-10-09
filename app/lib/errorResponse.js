import { NextResponse } from 'next/server'

const errorResponse = (err) => {
    console.log(err)
    console.log(JSON.stringify(err))

    switch(err.name) {
        case "TokenExpiredError": return NextResponse.json({ tokenExpired: true }, { status: 400 })
        case "JsonWebTokenError": return NextResponse.json({ tokenInvalid: true }, { status: 400 })
        default: return NextResponse.json({ error: "An unexpected error occurred." }, { status: 400 })
    }
}

export default errorResponse