import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Legacy Koterie bot is disabled. Use the protected Practice Lab when AI is enabled.' }, { status: 410 })
}
