import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

function validId(value: string) { return /^\d+$/.test(value) }
function dto(row: any) {
  return { id:String(row.id), title:row.title, content:row.content, author:row.author_name, authorEmail:'', authorRole:row.author_role||'student', category:row.category, createdAt:new Date(row.created_at).toISOString(), updatedAt:new Date(row.updated_at).toISOString(), replies:Number(row.replies||0), views:Number(row.views||0), pinned:!!row.pinned, tags:row.tags||[] }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const { id } = await context.params
  if (!validId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT t.*, COALESCE(p.role,'student') author_role, COUNT(r.id)::int replies
      FROM forum_threads t LEFT JOIN profiles p ON p.id=t.author_id LEFT JOIN forum_replies r ON r.thread_id=t.id
      WHERE t.id=${Number(id)} GROUP BY t.id,p.role LIMIT 1
    `
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ thread: dto(rows[0]) })
  } catch (error) {
    console.error('forum thread GET', error)
    return NextResponse.json({ error: 'Could not load discussion' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const { id } = await context.params
  if (!validId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const sql = getKoterieSql()
    await sql`UPDATE forum_threads SET views=views+1 WHERE id=${Number(id)}`
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Could not update discussion' }, { status: 500 })
  }
}
