import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'
import { createDownloadUrl } from '@/lib/koterie-storage'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error:'Invalid material' }, { status:400 })
  const sql = getKoterieSql()
  const rows = await sql`SELECT * FROM materials WHERE id=${Number(id)} AND active=true LIMIT 1`
  const item = rows[0] as any
  if (!item) return NextResponse.json({ error:'Material not found' }, { status:404 })
  const allowed = member.role !== 'student' || member.access === 'studio' || item.space === 'all' || item.space === 'academy'
  if (!allowed) return NextResponse.json({ error:'This material is not available in your space' }, { status:403 })
  if (item.source_type === 'link') return NextResponse.json({ url:item.external_url })
  try { return NextResponse.json({ url: await createDownloadUrl(item.object_key, item.file_name) }) }
  catch { return NextResponse.json({ error:'File storage is not configured yet' }, { status:503 }) }
}
