import { NextRequest, NextResponse } from 'next/server'
import { getMemberFromRequest, type MemberAccess, type MemberRole, type MemberSession } from '@/lib/member-session'
import { getKoterieSql } from '@/lib/koterie-db'

function currentRole(value: unknown): MemberRole {
  return value === 'teacher' || value === 'admin' ? value : 'student'
}
function currentAccess(value: unknown, role: MemberRole): MemberAccess {
  return role !== 'student' || value === 'studio' ? 'studio' : 'academy'
}

export async function memberOrResponse(request: NextRequest): Promise<MemberSession | NextResponse> {
  const signed = getMemberFromRequest(request)
  if (!signed) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id,email,display_name,role,level_space,active
      FROM profiles
      WHERE id=${signed.id}
      LIMIT 1
    `
    const row = rows[0] as any
    if (!row || row.active === false) {
      return NextResponse.json({ error: 'This Koterie access is inactive.' }, { status: 403 })
    }
    if (String(row.email || '').toLowerCase() !== signed.email.toLowerCase()) {
      return NextResponse.json({ error: 'Session no longer matches this account.' }, { status: 401 })
    }

    const role = currentRole(row.role)
    const access = currentAccess(row.level_space, role)
    return {
      id: row.id,
      name: row.display_name,
      email: row.email,
      role,
      access,
      exp: signed.exp,
    }
  } catch (error) {
    console.error('member authorization', error)
    return NextResponse.json({ error: 'Koterie access is temporarily unavailable.' }, { status: 503 })
  }
}

export async function teacherOrResponse(request: NextRequest): Promise<MemberSession | NextResponse> {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  if (member.role !== 'teacher' && member.role !== 'admin') {
    return NextResponse.json({ error: 'Teacher access required' }, { status: 403 })
  }
  return member
}

export function isResponse(value: MemberSession | NextResponse): value is NextResponse {
  return value instanceof NextResponse
}
