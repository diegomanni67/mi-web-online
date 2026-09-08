import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Legacy payment endpoint disabled.' }, { status: 410 })
}
