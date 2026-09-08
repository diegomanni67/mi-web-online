import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { rotatingActivity } from '@/lib/activity-bank'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member

  try {
    const sql = getKoterieSql()
    const [profileRows, groups, activities, upcomingSeminars, seminarRegistrations, ideas] = await Promise.all([
      sql`
        SELECT bio, learning_goals, interests, conversation_topics, availability, avatar_color
        FROM profiles WHERE id=${member.id} LIMIT 1
      `,
      sql`
        SELECT g.id, g.title, g.modality, g.teacher_name, g.weekday, g.start_time,
               g.duration_minutes, g.timezone, g.meeting_url
        FROM class_groups g
        JOIN class_group_members gm ON gm.group_id = g.id
        WHERE gm.profile_id = ${member.id} AND g.active = true
        ORDER BY g.weekday, g.start_time
      `,
      sql`
        SELECT id, space, title, prompt, activity_type, active_from, active_until
        FROM weekly_activities
        WHERE space IN (${member.access}, 'all')
          AND active_from <= CURRENT_DATE
          AND (active_until IS NULL OR active_until >= CURRENT_DATE)
        ORDER BY active_from DESC, id DESC
        LIMIT 3
      `,
      sql`
        SELECT id, title, starts_at, duration_minutes, price_ars, level, teacher_name, capacity
        FROM seminars
        WHERE status = 'published' AND starts_at >= now()
        ORDER BY starts_at ASC
        LIMIT 3
      `,
      sql`
        SELECT r.id AS registration_id, r.status AS registration_status,
               s.id, s.title, s.starts_at, s.duration_minutes, s.price_ars, s.level, s.teacher_name,
               s.status AS seminar_status,
               CASE WHEN r.status='confirmed' THEN s.meeting_url ELSE NULL END AS meeting_url,
               CASE WHEN s.recording_visibility='registered' AND r.status <> 'cancelled' THEN s.recording_url ELSE NULL END AS recording_url,
               (SELECT count(*)::int FROM seminar_resources sr
                 WHERE sr.seminar_id=s.id AND sr.active=true AND (
                   sr.visibility='public'
                   OR (sr.visibility='registered' AND r.status <> 'cancelled')
                   OR (sr.visibility='confirmed' AND r.status='confirmed')
                 )) AS resource_count
        FROM seminar_registrations r
        JOIN seminars s ON s.id=r.seminar_id
        WHERE (r.profile_id=${member.id} OR lower(r.email)=lower(${member.email}))
        ORDER BY CASE WHEN s.starts_at >= now() THEN 0 ELSE 1 END, s.starts_at ASC
        LIMIT 6
      `,
      sql`
        SELECT id,title,description,level,label
        FROM seminar_ideas
        WHERE active=true
        ORDER BY CASE WHEN lower(title) LIKE '%gothic%' THEN 0 ELSE 1 END, created_at ASC
        LIMIT 1
      `,
    ])

    const materials = member.access === 'studio'
      ? await sql`SELECT id,title,description,category,source_type,file_name,mime_type,created_at FROM materials WHERE active=true ORDER BY created_at DESC LIMIT 3`
      : await sql`SELECT id,title,description,category,source_type,file_name,mime_type,created_at FROM materials WHERE active=true AND space IN ('all','academy') ORDER BY created_at DESC LIMIT 3`

    const profile = (profileRows[0] || {}) as any
    const goals = Array.isArray(profile.learning_goals) ? profile.learning_goals : []
    const interests = Array.isArray(profile.interests) ? profile.interests : []
    const topics = Array.isArray(profile.conversation_topics) ? profile.conversation_topics : []
    const profileChecks = [Boolean(profile.bio), goals.length > 0, interests.length > 0, topics.length > 0, Boolean(profile.availability)]
    const profileCompletion = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100)

    return NextResponse.json({
      member: { name: member.name, access: member.access, role: member.role },
      profile: { completion: profileCompletion, avatarColor: profile.avatar_color || 'violet' },
      groups,
      activities: activities.length ? activities : [rotatingActivity(member.access)],
      upcomingSeminars,
      nextSeminar: upcomingSeminars[0] || null,
      seminarRegistrations,
      recentMaterials: materials,
      plannedSeminarIdea: ideas[0] || null,
    })
  } catch (error) {
    console.error('dashboard overview', error)
    return NextResponse.json({
      member: { name: member.name, access: member.access, role: member.role },
      profile: { completion: 0, avatarColor: 'violet' },
      groups: [],
      activities: [rotatingActivity(member.access)],
      upcomingSeminars: [],
      nextSeminar: null,
      seminarRegistrations: [],
      recentMaterials: [],
      plannedSeminarIdea: null,
      degraded: true,
    })
  }
}
