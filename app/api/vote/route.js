import { NextResponse } from 'next/server'
 
export async function GET() {
  const ongoing = ["a", "b"]
 
  return NextResponse.json({ ongoing })
}