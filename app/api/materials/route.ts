import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const sql = getKoterieSql()
  const rows = member.role !== 'student' || member.access === 'studio'
    ? await sql`SELECT id,title,description,space,category,source_type,file_name,mime_type,file_size_bytes,created_at FROM materials WHERE active=true ORDER BY created_at DESC`
    : await sql`SELECT id,title,description,space,category,source_type,file_name,mime_type,file_size_bytes,created_at FROM materials WHERE active=true AND space IN ('all','academy') ORDER BY created_at DESC`
  return NextResponse.json({ materials: rows })
}
