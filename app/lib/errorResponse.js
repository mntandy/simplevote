import { NextResponse } from 'next/server'

const errorResponse = (err) => {
    console.log(JSON.stringify(err))

    switch(err.name) {
        case "TokenExpiredError": return NextResponse.json({ expired: true }, { status: 400 })
        case "JsonWebTokenError": return NextResponse.json({ invalid: true }, { status: 400 })
        default: return NextResponse.json({ error: "An unexpected error occurred." }, { status: 400 })
    }
}

export default errorResponse