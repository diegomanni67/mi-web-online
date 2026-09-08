import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createMemberToken, safeCodeEquals, SESSION_COOKIE, type MemberAccess, type MemberRole } from '@/lib/member-session'
import { getKoterieSql } from '@/lib/koterie-db'

function clean(value: unknown, max = 200) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function accessForCode(code: string): { access: MemberAccess; role: MemberRole } | null {
  const admin = process.env.KOTERIE_ADMIN_CODE
  const teacher = process.env.KOTERIE_TEACHER_CODE
  const studio = process.env.KOTERIE_STUDIO_CODE
  const academy = process.env.KOTERIE_ACADEMY_CODE

  if (admin && safeCodeEquals(code, admin)) return { access: 'studio', role: 'admin' }
  if (teacher && safeCodeEquals(code, teacher)) return { access: 'studio', role: 'teacher' }
  if (studio && safeCodeEquals(code, studio)) return { access: 'studio', role: 'student' }
  if (academy && safeCodeEquals(code, academy)) return { access: 'academy', role: 'student' }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = clean(body.name, 60)
    const email = clean(body.email, 180).toLowerCase()
    const code = clean(body.code, 200)

    if (!email.includes('@') || code.length < 4) {
      return NextResponse.json({ error: 'Complete email and access code.' }, { status: 400 })
    }

    const suppliedPermission = accessForCode(code)
    if (!suppliedPermission) return NextResponse.json({ error: 'Invalid access code.' }, { status: 401 })

    const sql = getKoterieSql()
    const existingRows = await sql`
      SELECT id, display_name, role, level_space, active
      FROM profiles
      WHERE lower(email) = ${email}
      LIMIT 1
    `
    const existing = existingRows[0] as any

    if (!existing && suppliedPermission.role === 'student' && process.env.KOTERIE_ALLOW_SELF_ENROLLMENT !== 'true') {
      return NextResponse.json({ error: 'Your email has not been added to Koterie yet. Ask your teacher to add you.' }, { status: 403 })
    }
    if (!existing && name.length < 2) {
      return NextResponse.json({ error: 'Enter your name for your first access.' }, { status: 400 })
    }
    if (existing && existing.active === false) {
      return NextResponse.json({ error: 'This Koterie access is inactive. Contact your teacher.' }, { status: 403 })
    }

    let permission = suppliedPermission
    if (existing) {
      const existingRole: MemberRole = ['teacher', 'admin'].includes(existing.role) ? existing.role : 'student'
      const existingAccess: MemberAccess = existing.level_space === 'studio' ? 'studio' : 'academy'

      if (existingRole === 'student') {
        if (suppliedPermission.role !== 'student' || suppliedPermission.access !== existingAccess) {
          return NextResponse.json({ error: `Use the ${existingAccess === 'studio' ? 'Studio' : 'Academy'} access code assigned to you.` }, { status: 403 })
        }
        permission = { role: 'student', access: existingAccess }
      } else {
        if (suppliedPermission.role !== existingRole) {
          return NextResponse.json({ error: 'Use your teacher access code.' }, { status: 403 })
        }
        permission = { role: existingRole, access: 'studio' }
      }
    }

    const id = existing?.id || createHash('sha256').update(`koterie:${email}`).digest('hex').slice(0, 32)
    const displayName = existing?.display_name || name

    await sql`
      INSERT INTO profiles (id, email, display_name, role, level_space, active, last_login_at, updated_at)
      VALUES (${id}, ${email}, ${displayName}, ${permission.role}, ${permission.access}, true, now(), now())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        last_login_at = now(),
        updated_at = now()
    `

    const token = createMemberToken({ id, name: displayName, email, access: permission.access, role: permission.role })
    const response = NextResponse.json({ ok: true, member: { id, name: displayName, access: permission.access, role: permission.role } })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  } catch (error) {
    console.error('member login', error)
    return NextResponse.json({ error: 'Koterie access is temporarily unavailable.' }, { status: 503 })
  }
}
