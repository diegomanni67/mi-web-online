import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

function parseMeetingUrl(value: unknown) {
  const raw = String(value || '').trim().slice(0, 1000)
  if (!raw) return { value: null as string | null }
  try {
    const url = new URL(raw)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    return { value: url.toString() }
  } catch {
    return { error: 'Meeting link must start with http:// or https://.' }
  }
}

function parseClass(body: any, fallbackTeacher: string) {
  const title = String(body.title || '').trim().slice(0, 120)
  const teacherName = String(body.teacherName || fallbackTeacher).trim().slice(0, 80)
  const modality = body.modality === 'individual' ? 'individual' : 'group'
  const weekday = Number(body.weekday)
  const startTime = String(body.startTime || '').trim()
  const duration = Number(body.durationMinutes || 60)
  const meeting = parseMeetingUrl(body.meetingUrl)
  if (meeting.error) return { error: meeting.error }
  if (!title || !teacherName || weekday < 0 || weekday > 6 || !/^\d{2}:\d{2}$/.test(startTime) || duration < 30 || duration > 240) {
    return { error: 'Complete the class information.' }
  }
  return { title, teacherName, modality, weekday, startTime, duration, meetingUrl: meeting.value }
}

export async function GET(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT g.id,g.title,g.modality,g.teacher_name,g.weekday,g.start_time,g.duration_minutes,g.meeting_url,g.active,
             COUNT(gm.profile_id)::int members,
             COALESCE(
               json_agg(json_build_object('id',p.id,'name',p.display_name,'email',p.email,'access',p.level_space))
               FILTER (WHERE p.id IS NOT NULL), '[]'::json
             ) AS member_list
      FROM class_groups g
      LEFT JOIN class_group_members gm ON gm.group_id=g.id
      LEFT JOIN profiles p ON p.id=gm.profile_id
      GROUP BY g.id
      ORDER BY g.active DESC,g.weekday,g.start_time,g.title
    `
    return NextResponse.json({ groups: rows.map((row: any) => ({
      id: Number(row.id),
      title: row.title,
      modality: row.modality,
      teacher_name: row.teacher_name,
      weekday: Number(row.weekday),
      start_time: String(row.start_time).slice(0,5),
      duration_minutes: Number(row.duration_minutes),
      meeting_url: row.meeting_url || '',
      active: row.active !== false,
      members: Number(row.members || 0),
      memberList: Array.isArray(row.member_list) ? row.member_list : [],
    })) })
  } catch (error) {
    console.error('admin groups GET', error)
    return NextResponse.json({ error:'Could not load groups' }, { status:500 })
  }
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const parsed = parseClass(body, member.name)
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const sql = getKoterieSql()
    const rows = await sql`
      INSERT INTO class_groups (title,modality,teacher_name,weekday,start_time,duration_minutes,meeting_url)
      VALUES (${parsed.title},${parsed.modality},${parsed.teacherName},${parsed.weekday},${parsed.startTime},${parsed.duration},${parsed.meetingUrl})
      RETURNING id
    `
    return NextResponse.json({ok:true,id:String(rows[0].id)},{status:201})
  } catch(error) {
    console.error('admin groups POST',error)
    return NextResponse.json({error:'Could not create class'},{status:500})
  }
}

export async function PATCH(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Class id is required.' }, { status: 400 })
    const sql = getKoterieSql()

    if (body.action === 'set-active') {
      await sql`UPDATE class_groups SET active=${body.active !== false} WHERE id=${id}`
      return NextResponse.json({ ok: true })
    }

    const parsed = parseClass(body, member.name)
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })
    await sql`
      UPDATE class_groups SET title=${parsed.title}, modality=${parsed.modality}, teacher_name=${parsed.teacherName},
        weekday=${parsed.weekday}, start_time=${parsed.startTime}, duration_minutes=${parsed.duration}, meeting_url=${parsed.meetingUrl}
      WHERE id=${id}
    `
    return NextResponse.json({ ok: true })
  } catch(error) {
    console.error('admin groups PATCH',error)
    return NextResponse.json({error:'Could not update class'},{status:500})
  }
}
