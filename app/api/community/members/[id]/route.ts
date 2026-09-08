import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  try {
    const { id } = await context.params
    const profileId = String(id || '').trim().slice(0,64)
    if (!profileId) return NextResponse.json({ error:'Member id is required.' }, { status:400 })
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id,display_name,role,level_space,bio,learning_goals,interests,conversation_topics,availability,avatar_color,created_at
      FROM profiles WHERE id=${profileId} AND active=true LIMIT 1
    `
    const row = rows[0] as any
    if (!row) return NextResponse.json({ error:'Member not found.' }, { status:404 })
    return NextResponse.json({ member: {
      id: row.id,
      name: row.display_name,
      role: ['teacher','admin'].includes(row.role) ? row.role : 'student',
      access: row.level_space === 'studio' ? 'studio' : 'academy',
      bio: row.bio || '',
      goals: Array.isArray(row.learning_goals) ? row.learning_goals : [],
      interests: Array.isArray(row.interests) ? row.interests : [],
      conversationTopics: Array.isArray(row.conversation_topics) ? row.conversation_topics : [],
      availability: row.availability || '',
      avatarColor: row.avatar_color || 'violet',
      joinedAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    }})
  } catch(error) {
    console.error('community member detail', error)
    return NextResponse.json({ error:'Could not load member' }, { status:500 })
  }
}
