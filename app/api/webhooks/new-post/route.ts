import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Legacy webhook disabled.' }, { status: 410 })
}
