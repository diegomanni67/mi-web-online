import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'
import { createDownloadUrl } from '@/lib/koterie-storage'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Invalid resource.' }, { status: 400 })

  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT sr.*, r.status AS registration_status
      FROM seminar_resources sr
      LEFT JOIN seminar_registrations r
        ON r.seminar_id=sr.seminar_id
       AND (r.profile_id=${member.id} OR lower(r.email)=lower(${member.email}))
      WHERE sr.id=${Number(id)} AND sr.active=true
      ORDER BY r.updated_at DESC NULLS LAST
      LIMIT 1
    `
    const item = rows[0] as any
    if (!item) return NextResponse.json({ error: 'Resource not found.' }, { status: 404 })

    const registrationStatus = item.registration_status || null
    const allowed = member.role !== 'student'
      || item.visibility === 'public'
      || (item.visibility === 'registered' && registrationStatus && registrationStatus !== 'cancelled')
      || (item.visibility === 'confirmed' && registrationStatus === 'confirmed')
    if (!allowed) return NextResponse.json({ error: 'This resource is not available with your seminar status.' }, { status: 403 })

    if (item.source_type === 'link') return NextResponse.json({ url: item.external_url })
    try { return NextResponse.json({ url: await createDownloadUrl(item.object_key, item.file_name) }) }
    catch { return NextResponse.json({ error: 'File storage is not configured yet.' }, { status: 503 }) }
  } catch (error) {
    console.error('seminar resource download', error)
    return NextResponse.json({ error: 'Could not open this resource.' }, { status: 500 })
  }
}
