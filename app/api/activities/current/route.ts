import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'
import { rotatingActivity, type ActivitySpace } from '@/lib/activity-bank'

export async function GET(request: NextRequest) {
  const member = await memberOrResponse(request)
  if (isResponse(member)) return member

  const requested: ActivitySpace = request.nextUrl.searchParams.get('space') === 'studio' ? 'studio' : 'academy'
  const space: ActivitySpace = requested === 'studio' && (member.access === 'studio' || member.role !== 'student') ? 'studio' : 'academy'

  try {
    const sql = getKoterieSql()
    const rows = await sql`
      SELECT id, space, title, prompt, activity_type, active_from, active_until
      FROM weekly_activities
      WHERE space IN (${space}, 'all')
        AND active_from <= CURRENT_DATE
        AND (active_until IS NULL OR active_until >= CURRENT_DATE)
      ORDER BY active_from DESC, id DESC
      LIMIT 3
    `
    if (rows.length > 0) return NextResponse.json({ activities: rows, source: 'scheduled' })
  } catch (error) {
    console.error('activities current fallback', error)
  }

  return NextResponse.json({ activities: [rotatingActivity(space)], source: 'rotation' })
}
