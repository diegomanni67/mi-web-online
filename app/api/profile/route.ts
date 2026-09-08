import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

const avatarColors = ['violet','blue','pink','emerald','amber','cyan'] as const

function text(value: unknown, max: number) {
  return String(value || '').trim().slice(0, max)
}

function stringList(value: unknown, maxItems = 12, maxLength = 60) {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of value) {
    const clean = text(item, maxLength)
    const key = clean.toLowerCase()
    if (!clean || seen.has(key)) continue
    seen.add(key)
    result.push(clean)
    if (result.length >= maxItems) break
  }
  return result
}

function profileDto(row: any) {
  return {
    id: row.id,
    email: row.email || '',
    name: row.display_name,
    role: ['teacher','admin'].includes(row.role) ? row.role : 'student',
    access: row.level_space === 'studio' ? 'studio' : 'academy',
    bio: row.bio || '',
    goals: Array.isArray(row.learning_goals) ? row.learning_goals : [],
    interests: Array.isArray(row.interests) ? row.interests : [],
    conversationTopics: Array.isArray(row.conversation_topics) ? row.conversation_topics : [],
    availability: row.availability || '',
    avatarColor: avatarColors.includes(row.avatar_color) ? row.avatar_color : 'violet',
  }
}

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id,email,display_name,role,level_space,bio,learning_goals,interests,conversation_topics,availability,avatar_color
      FROM profiles WHERE id=${member.id} AND active=true LIMIT 1
    `
    if (!rows[0]) return NextResponse.json({ error:'Profile not found.' }, { status:404 })
    return NextResponse.json({ profile: profileDto(rows[0]) })
  } catch(error) {
    console.error('profile GET', error)
    return NextResponse.json({ error:'Could not load profile' }, { status:500 })
  }
}

export async function PATCH(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const name = text(body.name, 80)
    const bio = text(body.bio, 500) || null
    const availability = text(body.availability, 240) || null
    const goals = stringList(body.goals, 8, 80)
    const interests = stringList(body.interests, 12, 50)
    const conversationTopics = stringList(body.conversationTopics, 12, 60)
    const avatarColor = avatarColors.includes(body.avatarColor) ? body.avatarColor : 'violet'

    if (name.length < 2) return NextResponse.json({ error:'Your name is required.' }, { status:400 })

    const sql = getKoterieSql()
    const rows = await sql`
      UPDATE profiles SET
        display_name=${name},
        bio=${bio},
        learning_goals=${JSON.stringify(goals)}::jsonb,
        interests=${JSON.stringify(interests)}::jsonb,
        conversation_topics=${JSON.stringify(conversationTopics)}::jsonb,
        availability=${availability},
        avatar_color=${avatarColor},
        updated_at=now()
      WHERE id=${member.id} AND active=true
      RETURNING id,email,display_name,role,level_space,bio,learning_goals,interests,conversation_topics,availability,avatar_color
    `
    if (!rows[0]) return NextResponse.json({ error:'Profile not found.' }, { status:404 })
    return NextResponse.json({ ok:true, profile: profileDto(rows[0]) })
  } catch(error) {
    console.error('profile PATCH', error)
    return NextResponse.json({ error:'Could not update profile' }, { status:500 })
  }
}
