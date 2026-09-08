import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

function safeUrl(value: unknown) {
  const raw = String(value || '').trim().slice(0, 1200)
  if (!raw) return null
  const url = new URL(raw)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('URL_PROTOCOL')
  return url.toString()
}

const kinds = new Set(['preparation','handout','recording','link'])
const visibilities = new Set(['public','registered','confirmed'])

export async function GET(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const seminarId = Number(request.nextUrl.searchParams.get('seminarId') || 0)
    const rows = seminarId > 0
      ? await sql`SELECT * FROM seminar_resources WHERE seminar_id=${seminarId} ORDER BY created_at DESC`
      : await sql`SELECT * FROM seminar_resources ORDER BY created_at DESC LIMIT 500`
    return NextResponse.json({ resources: rows })
  } catch (error) {
    console.error('admin seminar resources GET', error)
    return NextResponse.json({ error: 'Could not load seminar resources.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const seminarId = Number(body.seminarId)
    const title = String(body.title || '').trim().slice(0, 180)
    const description = String(body.description || '').trim().slice(0, 3000) || null
    const kind = kinds.has(String(body.kind)) ? String(body.kind) : 'handout'
    const visibility = visibilities.has(String(body.visibility)) ? String(body.visibility) : 'confirmed'
    const sourceType = body.sourceType === 'upload' ? 'upload' : 'link'
    const objectKey = sourceType === 'upload' ? String(body.objectKey || '').trim().slice(0, 1024) : null
    let externalUrl: string | null = null
    try { externalUrl = sourceType === 'link' ? safeUrl(body.externalUrl) : null } catch { return NextResponse.json({ error: 'Link must start with http:// or https://.' }, { status: 400 }) }

    if (!Number.isInteger(seminarId) || seminarId <= 0 || !title) return NextResponse.json({ error: 'Seminar and title are required.' }, { status: 400 })
    if (sourceType === 'upload' && !objectKey) return NextResponse.json({ error: 'Upload metadata is missing.' }, { status: 400 })
    if (sourceType === 'link' && !externalUrl) return NextResponse.json({ error: 'A valid link is required.' }, { status: 400 })

    const fileName = sourceType === 'upload' ? String(body.fileName || '').trim().slice(0, 255) || null : null
    const mimeType = sourceType === 'upload' ? String(body.mimeType || '').trim().slice(0, 255) || null : null
    const fileSize = sourceType === 'upload' && Number.isFinite(Number(body.fileSizeBytes)) ? Number(body.fileSizeBytes) : null

    const sql = getKoterieSql()
    const seminarRows = await sql`SELECT id FROM seminars WHERE id=${seminarId} LIMIT 1`
    if (!seminarRows[0]) return NextResponse.json({ error: 'Seminar not found.' }, { status: 404 })

    const rows = await sql`
      INSERT INTO seminar_resources (
        seminar_id,title,description,kind,source_type,object_key,external_url,file_name,mime_type,file_size_bytes,visibility,created_by
      ) VALUES (
        ${seminarId},${title},${description},${kind},${sourceType},${objectKey},${externalUrl},${fileName},${mimeType},${fileSize},${visibility},${member.id}
      ) RETURNING id
    `
    return NextResponse.json({ ok: true, id: String(rows[0].id) }, { status: 201 })
  } catch (error) {
    console.error('admin seminar resources POST', error)
    return NextResponse.json({ error: 'Could not save seminar resource.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Resource is required.' }, { status: 400 })
    const sql = getKoterieSql()
    await sql`UPDATE seminar_resources SET active=${body.active !== false},updated_at=now() WHERE id=${id}`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('admin seminar resources PATCH', error)
    return NextResponse.json({ error: 'Could not update seminar resource.' }, { status: 500 })
  }
}
