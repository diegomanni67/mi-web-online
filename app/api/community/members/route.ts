import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id, display_name, role, level_space, bio, interests, conversation_topics, avatar_color, created_at
      FROM profiles
      WHERE active = true
      ORDER BY CASE WHEN role IN ('teacher','admin') THEN 0 ELSE 1 END, display_name ASC
      LIMIT 500
    `
    return NextResponse.json({
      members: rows.map((row: any) => ({
        id: row.id,
        name: row.display_name,
        access: row.level_space === 'studio' ? 'studio' : 'academy',
        role: ['teacher', 'admin'].includes(row.role) ? row.role : 'student',
        bio: row.bio || '',
        interests: Array.isArray(row.interests) ? row.interests : [],
        conversationTopics: Array.isArray(row.conversation_topics) ? row.conversation_topics : [],
        avatarColor: row.avatar_color || 'violet',
        joinedAt: new Date(row.created_at).toISOString(),
      })),
    })
  } catch (error) {
    console.error('community members', error)
    return NextResponse.json({ error: 'Could not load community' }, { status: 500 })
  }
}
