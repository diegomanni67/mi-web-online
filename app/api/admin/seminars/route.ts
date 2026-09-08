import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

function safeUrl(value: unknown) {
  const raw = String(value || '').trim().slice(0,1000)
  if (!raw) return null
  const url = new URL(raw)
  if (!['http:','https:'].includes(url.protocol)) throw new Error('URL_PROTOCOL')
  return url.toString()
}

export async function GET(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const [seminars, registrations] = await Promise.all([
      sql`
        SELECT s.*,
          (SELECT count(*)::int FROM seminar_registrations r WHERE r.seminar_id=s.id AND r.status='confirmed') AS confirmed_count,
          (SELECT count(*)::int FROM seminar_registrations r WHERE r.seminar_id=s.id AND r.status='pending') AS pending_count,
          (SELECT count(*)::int FROM seminar_registrations r WHERE r.seminar_id=s.id AND r.status='waitlist') AS waitlist_count
        FROM seminars s ORDER BY starts_at DESC LIMIT 100
      `,
      sql`SELECT id,seminar_id,name,email,status,created_at FROM seminar_registrations ORDER BY created_at DESC LIMIT 500`,
    ])
    return NextResponse.json({ seminars, registrations })
  } catch(error) {
    console.error('admin seminars GET',error)
    return NextResponse.json({error:'Could not load seminars'},{status:500})
  }
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const title = String(body.title||'').trim().slice(0,160)
    const description = String(body.description||'').trim().slice(0,5000)
    const level = String(body.level||'B2-C2').trim().slice(0,60)
    const teacherName = String(body.teacherName||'').trim().slice(0,120) || null
    const rawStartsAt = String(body.startsAt || '').trim()
    const startsAt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(rawStartsAt) ? new Date(`${rawStartsAt}:00-03:00`) : new Date('invalid')
    const duration = Number(body.durationMinutes || 90)
    const price = body.priceArs === '' || body.priceArs == null ? null : Number(body.priceArs)
    const capacity = body.capacity === '' || body.capacity == null ? null : Number(body.capacity)
    let reservation: string | null = null
    try { reservation = safeUrl(body.reservationUrl) } catch { return NextResponse.json({ error:'Reservation URL must start with http:// or https://.' }, { status:400 }) }
    if (!title || !description || Number.isNaN(startsAt.getTime())) return NextResponse.json({ error:'Title, description and date are required.' }, { status:400 })
    if (duration < 30 || duration > 360) return NextResponse.json({ error:'Invalid duration.' }, { status:400 })
    if (price !== null && (!Number.isFinite(price) || price < 0)) return NextResponse.json({ error:'Invalid price.' }, { status:400 })
    if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000)) return NextResponse.json({ error:'Invalid capacity.' }, { status:400 })
    const sql = getKoterieSql()
    const rows = await sql`
      INSERT INTO seminars (title,description,level,starts_at,duration_minutes,price_ars,reservation_url,status,teacher_name,capacity,registration_open,registration_note)
      VALUES (${title},${description},${level},${startsAt.toISOString()},${duration},${price},${reservation},${body.publish ? 'published':'draft'},${teacherName},${capacity},${body.registrationOpen !== false},${String(body.registrationNote||'').trim().slice(0,1000) || null}) RETURNING id
    `
    return NextResponse.json({ ok:true, id:String(rows[0].id) }, { status:201 })
  } catch (error) {
    console.error('admin seminar', error)
    return NextResponse.json({ error:'Could not save seminar' }, { status:500 })
  }
}

export async function PATCH(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const sql = getKoterieSql()

    if (body.registrationId) {
      const registrationId = Number(body.registrationId)
      const status = ['pending','confirmed','waitlist','cancelled'].includes(body.status) ? body.status : null
      if (!Number.isInteger(registrationId) || registrationId <= 0 || !status) return NextResponse.json({error:'Registration and status are required.'},{status:400})
      await sql`UPDATE seminar_registrations SET status=${status},updated_at=now() WHERE id=${registrationId}`
      return NextResponse.json({ok:true})
    }

    const id = Number(body.id)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({error:'Seminar is required.'},{status:400})

    if (body.status) {
      const status = ['draft','published','completed','cancelled'].includes(body.status) ? body.status : null
      if (!status) return NextResponse.json({error:'Invalid status.'},{status:400})
      await sql`UPDATE seminars SET status=${status},updated_at=now() WHERE id=${id}`
      return NextResponse.json({ok:true})
    }

    let recordingUrl: string | null = null
    let meetingUrl: string | null = null
    try { recordingUrl = safeUrl(body.recordingUrl); meetingUrl = safeUrl(body.meetingUrl) } catch { return NextResponse.json({ error:'URLs must start with http:// or https://.' }, { status:400 }) }
    await sql`
      UPDATE seminars SET
        registration_open=${body.registrationOpen !== false},
        registration_note=${String(body.registrationNote||'').trim().slice(0,1000) || null},
        meeting_url=${meetingUrl},
        recording_url=${recordingUrl},
        recording_visibility=${body.recordingVisibility === 'registered' ? 'registered' : 'hidden'},
        updated_at=now()
      WHERE id=${id}
    `
    return NextResponse.json({ok:true})
  } catch(error) {
    console.error('admin seminar PATCH',error)
    return NextResponse.json({error:'Could not update seminar'},{status:500})
  }
}
