import { NextRequest, NextResponse } from 'next/server'
import { getKoterieSql } from '@/lib/koterie-db'
import { getMemberFromRequest } from '@/lib/member-session'

export async function GET() {
  try {
    const sql = getKoterieSql()
    const [seminars, ideas] = await Promise.all([
      sql`
        SELECT s.id, s.title, s.description, s.level, s.starts_at, s.duration_minutes,
               s.price_ars, s.reservation_url, s.teacher_name, s.capacity, s.registration_open,
               s.registration_note,
               (SELECT count(*)::int FROM seminar_registrations r WHERE r.seminar_id=s.id AND r.status='confirmed') AS confirmed_count
        FROM seminars s
        WHERE s.status = 'published' AND s.starts_at >= now()
        ORDER BY s.starts_at ASC
        LIMIT 20
      `,
      sql`
        SELECT id, title, description, level, label
        FROM seminar_ideas
        WHERE active = true
        ORDER BY created_at ASC
        LIMIT 20
      `,
    ])
    return NextResponse.json({
      seminars: seminars.map((row: any) => ({
        id: String(row.id), title: row.title, description: row.description, level: row.level,
        startsAt: new Date(row.starts_at).toISOString(), durationMinutes: Number(row.duration_minutes),
        priceArs: row.price_ars === null ? null : Number(row.price_ars), reservationUrl: row.reservation_url || null,
        teacherName: row.teacher_name || null, capacity: row.capacity === null ? null : Number(row.capacity),
        registrationOpen: row.registration_open !== false, registrationNote: row.registration_note || null,
        confirmedCount: Number(row.confirmed_count || 0),
      })),
      ideas: ideas.map((row: any) => ({ id: String(row.id), title: row.title, description: row.description, level: row.level, label: row.label })),
    })
  } catch (error) {
    console.error('seminars GET', error)
    return NextResponse.json({ error: 'Could not load seminars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const seminarId = Number(body.seminarId)
    if (!Number.isInteger(seminarId) || seminarId <= 0) return NextResponse.json({ error: 'Invalid seminar.' }, { status: 400 })

    const signed = getMemberFromRequest(request)
    const name = String(signed?.name || body.name || '').trim().slice(0,120)
    const email = String(signed?.email || body.email || '').trim().toLowerCase().slice(0,255)
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Name and valid email are required.' }, { status: 400 })

    const sql = getKoterieSql()
    const seminarRows = await sql`
      SELECT id, capacity, registration_open, starts_at
      FROM seminars
      WHERE id=${seminarId} AND status='published' AND starts_at >= now()
      LIMIT 1
    `
    const seminar = seminarRows[0] as any
    if (!seminar) return NextResponse.json({ error: 'This seminar is not available for registration.' }, { status: 404 })
    if (seminar.registration_open === false) return NextResponse.json({ error: 'Registration is currently closed.' }, { status: 409 })

    const existing = await sql`SELECT id,status FROM seminar_registrations WHERE seminar_id=${seminarId} AND lower(email)=lower(${email}) LIMIT 1`
    if (existing[0]) return NextResponse.json({ ok: true, status: existing[0].status, alreadyRegistered: true })

    const countRows = await sql`SELECT count(*)::int AS count FROM seminar_registrations WHERE seminar_id=${seminarId} AND status='confirmed'`
    const confirmed = Number((countRows[0] as any)?.count || 0)
    const capacity = seminar.capacity === null ? null : Number(seminar.capacity)
    const status = capacity !== null && confirmed >= capacity ? 'waitlist' : 'pending'

    const rows = await sql`
      INSERT INTO seminar_registrations (seminar_id, profile_id, name, email, status)
      VALUES (${seminarId}, ${signed?.id || null}, ${name}, ${email}, ${status})
      RETURNING id,status
    `
    return NextResponse.json({ ok: true, id: String(rows[0].id), status: rows[0].status }, { status: 201 })
  } catch (error) {
    console.error('seminars POST', error)
    return NextResponse.json({ error: 'Could not register for seminar.' }, { status: 500 })
  }
}
