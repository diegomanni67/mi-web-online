import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

function emailOf(value: unknown) { return String(value || '').trim().toLowerCase().slice(0, 180) }
function text(value: unknown, max: number) { return String(value || '').trim().slice(0, max) }

export async function GET(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT p.id, p.email, p.display_name, p.role, p.level_space, p.active,
             p.teacher_notes, p.created_at, p.last_login_at,
             COALESCE(
               json_agg(json_build_object('id', g.id, 'title', g.title))
               FILTER (WHERE g.id IS NOT NULL), '[]'::json
             ) AS groups
      FROM profiles p
      LEFT JOIN class_group_members gm ON gm.profile_id = p.id
      LEFT JOIN class_groups g ON g.id = gm.group_id AND g.active = true
      GROUP BY p.id
      ORDER BY CASE WHEN p.role IN ('admin','teacher') THEN 0 ELSE 1 END,
               p.active DESC, p.display_name ASC
      LIMIT 1000
    `
    return NextResponse.json({ members: rows.map((row: any) => ({
      id: row.id,
      email: row.email || '',
      name: row.display_name,
      role: ['teacher','admin'].includes(row.role) ? row.role : 'student',
      access: row.level_space === 'studio' ? 'studio' : 'academy',
      active: row.active !== false,
      notes: row.teacher_notes || '',
      joinedAt: row.created_at ? new Date(row.created_at).toISOString() : null,
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at).toISOString() : null,
      groups: Array.isArray(row.groups) ? row.groups : [],
    })) })
  } catch (error) {
    console.error('admin members GET', error)
    return NextResponse.json({ error: 'Could not load students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const email = emailOf(body.email)
    const name = text(body.name, 80)
    const requestedAccess = body.access === 'studio' ? 'studio' : 'academy'
    const requestedRole = ['student','teacher','admin'].includes(body.role) ? body.role : 'student'
    const role = member.role === 'admin' ? requestedRole : 'student'
    const access = role === 'student' ? requestedAccess : 'studio'
    const notes = text(body.notes, 2000) || null
    if (!name || !email.includes('@')) return NextResponse.json({ error: 'Name and a valid email are required.' }, { status: 400 })

    const id = createHash('sha256').update(`koterie:${email}`).digest('hex').slice(0, 32)
    const sql = getKoterieSql()
    await sql`
      INSERT INTO profiles (id,email,display_name,role,level_space,active,teacher_notes,updated_at)
      VALUES (${id},${email},${name},${role},${access},true,${notes},now())
      ON CONFLICT (id) DO UPDATE SET
        email=EXCLUDED.email,
        display_name=EXCLUDED.display_name,
        level_space=EXCLUDED.level_space,
        teacher_notes=EXCLUDED.teacher_notes,
        active=true,
        updated_at=now()
    `
    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (error) {
    console.error('admin members POST', error)
    return NextResponse.json({ error: 'Could not save student' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const id = text(body.id, 64)
    if (!id) return NextResponse.json({ error: 'Student id is required.' }, { status: 400 })

    const sql = getKoterieSql()
    const found = await sql`SELECT id, role FROM profiles WHERE id=${id} LIMIT 1`
    if (!found[0]) return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
    if (member.role !== 'admin' && found[0].role !== 'student') return NextResponse.json({ error: 'Only an admin can edit teacher accounts.' }, { status: 403 })

    const name = text(body.name, 80)
    const requestedAccess = body.access === 'studio' ? 'studio' : 'academy'
    const active = body.active !== false
    const notes = text(body.notes, 2000) || null
    const requestedRole = ['student','teacher','admin'].includes(body.role) ? body.role : found[0].role
    const role = member.role === 'admin' ? requestedRole : 'student'
    const access = role === 'student' ? requestedAccess : 'studio'
    if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    if (id === member.id && !active) return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 400 })

    await sql`
      UPDATE profiles SET display_name=${name}, level_space=${access}, role=${role},
        active=${active}, teacher_notes=${notes}, updated_at=now()
      WHERE id=${id}
    `
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('admin members PATCH', error)
    return NextResponse.json({ error: 'Could not update student' }, { status: 500 })
  }
}
