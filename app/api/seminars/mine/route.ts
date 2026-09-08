import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member

  try {
    const sql = getKoterieSql()
    const [registrations, resources] = await Promise.all([
      sql`
        SELECT r.id AS registration_id,r.status AS registration_status,r.created_at AS registered_at,
               s.id,s.title,s.description,s.level,s.starts_at,s.duration_minutes,s.price_ars,s.teacher_name,
               s.capacity,s.registration_open,s.registration_note,s.status AS seminar_status,s.meeting_url,s.recording_url,s.recording_visibility
        FROM seminar_registrations r
        JOIN seminars s ON s.id=r.seminar_id
        WHERE (r.profile_id=${member.id} OR lower(r.email)=lower(${member.email}))
        ORDER BY CASE WHEN s.starts_at >= now() THEN 0 ELSE 1 END, s.starts_at ASC
        LIMIT 50
      `,
      sql`
        SELECT sr.id,sr.seminar_id,sr.title,sr.description,sr.kind,sr.source_type,sr.file_name,sr.mime_type,
               sr.file_size_bytes,sr.visibility,r.status AS registration_status
        FROM seminar_resources sr
        JOIN seminar_registrations r ON r.seminar_id=sr.seminar_id
        WHERE sr.active=true
          AND (r.profile_id=${member.id} OR lower(r.email)=lower(${member.email}))
        ORDER BY sr.created_at DESC
        LIMIT 300
      `,
    ])

    const result = registrations.map((row: any) => {
      const status = String(row.registration_status)
      const allowedResources = resources.filter((resource: any) => {
        if (Number(resource.seminar_id) !== Number(row.id)) return false
        if (resource.visibility === 'public') return true
        if (resource.visibility === 'registered') return status !== 'cancelled'
        return status === 'confirmed'
      })
      return {
        registrationId: String(row.registration_id),
        registrationStatus: status,
        registeredAt: new Date(row.registered_at).toISOString(),
        seminar: {
          id: String(row.id), title: row.title, description: row.description, level: row.level,
          startsAt: new Date(row.starts_at).toISOString(), durationMinutes: Number(row.duration_minutes),
          priceArs: row.price_ars === null ? null : Number(row.price_ars), teacherName: row.teacher_name || null,
          capacity: row.capacity === null ? null : Number(row.capacity), registrationOpen: row.registration_open !== false,
          registrationNote: row.registration_note || null, status: row.seminar_status,
          meetingUrl: status === 'confirmed' ? row.meeting_url || null : null,
          recordingUrl: row.recording_visibility === 'registered' && status !== 'cancelled' ? row.recording_url || null : null,
        },
        resources: allowedResources.map((resource: any) => ({
          id: String(resource.id), title: resource.title, description: resource.description || null, kind: resource.kind,
          sourceType: resource.source_type, fileName: resource.file_name || null, mimeType: resource.mime_type || null,
          fileSizeBytes: resource.file_size_bytes === null ? null : Number(resource.file_size_bytes), visibility: resource.visibility,
        })),
      }
    })

    return NextResponse.json({ registrations: result })
  } catch (error) {
    console.error('seminars mine GET', error)
    return NextResponse.json({ error: 'Could not load your seminars.' }, { status: 500 })
  }
}
