import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { canWriteSpace } from '@/lib/member-session'
import { getKoterieSql } from '@/lib/koterie-db'

function replyDto(row: any) {
  return { id:String(row.id), threadId:String(row.thread_id), content:row.content, author:row.author_name, authorEmail:'', authorRole:row.author_role||'student', createdAt:new Date(row.created_at).toISOString(), likes:Number(row.likes||0), parentId:row.parent_id == null ? undefined : String(row.parent_id) }
}

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const threadId = request.nextUrl.searchParams.get('threadId') || ''
  if (!/^\d+$/.test(threadId)) return NextResponse.json({ error: 'Invalid thread' }, { status: 400 })
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT r.*, COALESCE(p.role,'student') author_role
      FROM forum_replies r LEFT JOIN profiles p ON p.id=r.author_id
      WHERE r.thread_id=${Number(threadId)} ORDER BY r.created_at ASC
    `
    return NextResponse.json({ replies: rows.map(replyDto) })
  } catch (error) {
    console.error('forum replies GET', error)
    return NextResponse.json({ error: 'Could not load replies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const threadId = String(body.threadId || '')
    const content = typeof body.content === 'string' ? body.content.trim().slice(0, 2000) : ''
    const parentId = body.parentId == null || body.parentId === '' ? null : String(body.parentId)
    if (!/^\d+$/.test(threadId) || !content) return NextResponse.json({ error: 'Reply content is required.' }, { status: 400 })
    if (parentId && !/^\d+$/.test(parentId)) return NextResponse.json({ error: 'Invalid parent reply.' }, { status: 400 })

    const sql = getKoterieSql()
    const threadRows = await sql`SELECT id, space FROM forum_threads WHERE id=${Number(threadId)} LIMIT 1`
    const thread = threadRows[0]
    if (!thread) return NextResponse.json({ error: 'Discussion not found.' }, { status: 404 })
    if (!canWriteSpace(member, thread.space === 'studio' ? 'studio' : 'academy')) return NextResponse.json({ error: 'Studio posting requires Studio access.' }, { status: 403 })

    if (parentId) {
      const parent = await sql`SELECT id FROM forum_replies WHERE id=${Number(parentId)} AND thread_id=${Number(threadId)} LIMIT 1`
      if (!parent[0]) return NextResponse.json({ error: 'Parent reply not found.' }, { status: 400 })
    }

    const rows = await sql`
      INSERT INTO forum_replies (thread_id, author_id, author_name, content, parent_id)
      VALUES (${Number(threadId)}, ${member.id}, ${member.name}, ${content}, ${parentId ? Number(parentId) : null})
      RETURNING *
    `
    await sql`UPDATE forum_threads SET updated_at=now() WHERE id=${Number(threadId)}`
    return NextResponse.json({ reply: replyDto({ ...rows[0], author_role: member.role }) }, { status: 201 })
  } catch (error) {
    console.error('forum replies POST', error)
    return NextResponse.json({ error: 'Could not publish reply' }, { status: 500 })
  }
}
