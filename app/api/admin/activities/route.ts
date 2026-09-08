import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id,space,title,prompt,activity_type,active_from,active_until,created_at
      FROM weekly_activities
      ORDER BY active_from DESC,id DESC
      LIMIT 100
    `
    return NextResponse.json({ activities: rows })
  } catch (error) {
    console.error('admin activity GET', error)
    return NextResponse.json({ error:'Could not load activities' }, { status:500 })
  }
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const space = ['academy','studio','all'].includes(body.space) ? body.space : 'all'
    const title = String(body.title || '').trim().slice(0, 120)
    const prompt = String(body.prompt || '').trim().slice(0, 4000)
    const activeFrom = /^\d{4}-\d{2}-\d{2}$/.test(body.activeFrom || '') ? body.activeFrom : new Date().toISOString().slice(0,10)
    const activeUntil = /^\d{4}-\d{2}-\d{2}$/.test(body.activeUntil || '') ? body.activeUntil : null
    if (!title || !prompt) return NextResponse.json({ error: 'Title and prompt are required.' }, { status: 400 })
    if (activeUntil && activeUntil < activeFrom) return NextResponse.json({ error: 'End date cannot be before start date.' }, { status: 400 })
    const sql = getKoterieSql()
    const rows = await sql`INSERT INTO weekly_activities (space,title,prompt,active_from,active_until) VALUES (${space},${title},${prompt},${activeFrom},${activeUntil}) RETURNING id`
    return NextResponse.json({ ok:true, id:String(rows[0].id) }, { status:201 })
  } catch (error) {
    console.error('admin activity', error)
    return NextResponse.json({ error:'Could not save activity' }, { status:500 })
  }
}

export async function PATCH(request: NextRequest) {
  const member = await teacherOrResponse(request)
  if (isResponse(member)) return member
  try {
    const body = await request.json()
    const id = Number(body.id)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error:'Activity id is required.' }, { status:400 })
    const sql = getKoterieSql()
    if (body.action === 'end') {
      await sql`UPDATE weekly_activities SET active_until=CURRENT_DATE WHERE id=${id}`
      return NextResponse.json({ ok:true })
    }
    const activeUntil = /^\d{4}-\d{2}-\d{2}$/.test(body.activeUntil || '') ? body.activeUntil : null
    await sql`UPDATE weekly_activities SET active_until=${activeUntil} WHERE id=${id}`
    return NextResponse.json({ ok:true })
  } catch(error) {
    console.error('admin activity PATCH',error)
    return NextResponse.json({error:'Could not update activity'},{status:500})
  }
}
