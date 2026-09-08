import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { canWriteSpace, type MemberAccess } from '@/lib/member-session'
import { getKoterieSql } from '@/lib/koterie-db'

function threadDto(row: any) {
  return {
    id: String(row.id), title: row.title, content: row.content, author: row.author_name,
    authorEmail: '', authorRole: row.author_role || 'student', category: row.category,
    createdAt: new Date(row.created_at).toISOString(), updatedAt: new Date(row.updated_at).toISOString(),
    replies: Number(row.replies || 0), views: Number(row.views || 0), pinned: !!row.pinned, tags: row.tags || [],
  }
}

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const space = request.nextUrl.searchParams.get('space') === 'studio' ? 'studio' : 'academy'
  const category = request.nextUrl.searchParams.get('category')?.trim() || null
  try {
    const sql = getKoterieSql()
    const rows = category
      ? await sql`
          SELECT t.*, COALESCE(p.role, 'student') author_role, COUNT(r.id)::int replies
          FROM forum_threads t LEFT JOIN profiles p ON p.id=t.author_id LEFT JOIN forum_replies r ON r.thread_id=t.id
          WHERE t.space=${space} AND t.category=${category}
          GROUP BY t.id, p.role ORDER BY t.pinned DESC, t.updated_at DESC LIMIT 100
        `
      : await sql`
          SELECT t.*, COALESCE(p.role, 'student') author_role, COUNT(r.id)::int replies
          FROM forum_threads t LEFT JOIN profiles p ON p.id=t.author_id LEFT JOIN forum_replies r ON r.thread_id=t.id
          WHERE t.space=${space}
          GROUP BY t.id, p.role ORDER BY t.pinned DESC, t.updated_at DESC LIMIT 100
        `
    return NextResponse.json({ threads: rows.map(threadDto) })
  } catch (error) {
    console.error('forum threads GET', error)
    return NextResponse.json({ error: 'Could not load discussions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const space: MemberAccess = body.space === 'studio' ? 'studio' : 'academy'
    if (!canWriteSpace(member, space)) return NextResponse.json({ error: 'Studio posting requires Studio access.' }, { status: 403 })
    const category = typeof body.category === 'string' ? body.category.trim().slice(0, 40) : ''
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 100) : ''
    const content = typeof body.content === 'string' ? body.content.trim().slice(0, 4000) : ''
    const tags = Array.isArray(body.tags) ? body.tags.map((tag: unknown) => String(tag).trim().toLowerCase().slice(0, 24)).filter(Boolean).slice(0, 5) : []
    if (!category || title.length < 3 || content.length < 2) return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 })

    const sql = getKoterieSql()
    const rows = await sql`
      INSERT INTO forum_threads (space, category, author_id, author_name, title, content, tags)
      VALUES (${space}, ${category}, ${member.id}, ${member.name}, ${title}, ${content}, array_remove(ARRAY[${tags[0] || null}, ${tags[1] || null}, ${tags[2] || null}, ${tags[3] || null}, ${tags[4] || null}]::text[], NULL))
      RETURNING *
    `
    return NextResponse.json({ thread: threadDto({ ...rows[0], author_role: member.role, replies: 0 }) }, { status: 201 })
  } catch (error) {
    console.error('forum threads POST', error)
    return NextResponse.json({ error: 'Could not publish discussion' }, { status: 500 })
  }
}
