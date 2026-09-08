import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { rotatingActivity } from '@/lib/activity-bank'
import { getKoterieSql } from '@/lib/koterie-db'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member
  const requested = request.nextUrl.searchParams.get('space')
  const space = requested === 'studio' && (member.access === 'studio' || member.role !== 'student') ? 'studio' : 'academy'

  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id, space, title, prompt, activity_type, active_from, active_until
      FROM weekly_activities
      WHERE space IN (${space}, 'all')
        AND active_from <= CURRENT_DATE
        AND (active_until IS NULL OR active_until >= CURRENT_DATE)
      ORDER BY active_from DESC, id DESC
      LIMIT 5
    `
    if (rows.length) return NextResponse.json({ activities: rows, source: 'scheduled' })
  } catch (error) {
    console.error('activities fallback', error)
  }

  return NextResponse.json({ activities: [rotatingActivity(space)], source: 'rotation' })
}
