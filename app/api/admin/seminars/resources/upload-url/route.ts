import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { createUploadUrl } from '@/lib/koterie-storage'
import { getKoterieSql } from '@/lib/koterie-db'

const allowedTypes = new Set([
  'application/pdf',
  'audio/mpeg','audio/mp4','audio/x-m4a','audio/wav',
  'image/jpeg','image/png','image/webp',
])
const MAX_BYTES = 25 * 1024 * 1024

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(-100) || 'file'
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member

  const body = await request.json()
  const seminarId = Number(body.seminarId)
  const fileName = cleanName(String(body.fileName || ''))
  const mimeType = String(body.mimeType || '')
  const size = Number(body.size || 0)

  if (!Number.isInteger(seminarId) || seminarId <= 0) return NextResponse.json({ error: 'Invalid seminar.' }, { status: 400 })
  if (!allowedTypes.has(mimeType)) return NextResponse.json({ error: 'Use PDF, MP3/M4A/WAV, JPG, PNG or WebP files. Recordings should use a private link.' }, { status: 400 })
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES) return NextResponse.json({ error: 'Files must be 25 MB or smaller.' }, { status: 400 })

  const sql = getKoterieSql()
  const rows = await sql`SELECT id FROM seminars WHERE id=${seminarId} LIMIT 1`
  if (!rows[0]) return NextResponse.json({ error: 'Seminar not found.' }, { status: 404 })

  const objectKey = `seminars/${seminarId}/${new Date().getUTCFullYear()}/${randomUUID()}-${fileName}`
  try {
    return NextResponse.json({ objectKey, uploadUrl: await createUploadUrl(objectKey, mimeType), expiresIn: 600 })
  } catch {
    return NextResponse.json({ error: 'File storage is not configured yet.' }, { status: 503 })
  }
}
