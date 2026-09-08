import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  return NextResponse.json({ member: { id: member.id, name: member.name, email: member.email, access: member.access, role: member.role } })
}
