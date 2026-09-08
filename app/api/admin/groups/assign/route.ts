import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

export async function POST(request: NextRequest) {
  const member=await teacherOrResponse(request)
  if(isResponse(member)) return member
  try{
    const body=await request.json()
    const groupId=String(body.groupId||'')
    const profileId=String(body.profileId||'').trim()
    const email=String(body.email||'').trim().toLowerCase()
    if(!/^\d+$/.test(groupId) || (!profileId && !email.includes('@'))) return NextResponse.json({error:'Choose a class and a student.'},{status:400})
    const sql=getKoterieSql()
    const profiles = profileId
      ? await sql`SELECT id,display_name FROM profiles WHERE id=${profileId} AND active=true LIMIT 1`
      : await sql`SELECT id,display_name FROM profiles WHERE lower(email)=${email} AND active=true LIMIT 1`
    if(!profiles[0]) return NextResponse.json({error:'Student not found or inactive.'},{status:404})
    const groups=await sql`SELECT id FROM class_groups WHERE id=${Number(groupId)} AND active=true LIMIT 1`
    if(!groups[0]) return NextResponse.json({error:'Class not found.'},{status:404})
    await sql`INSERT INTO class_group_members (group_id,profile_id) VALUES (${Number(groupId)},${profiles[0].id}) ON CONFLICT DO NOTHING`
    return NextResponse.json({ok:true,student:profiles[0].display_name})
  }catch(error){console.error('assign group',error);return NextResponse.json({error:'Could not assign student'},{status:500})}
}

export async function DELETE(request: NextRequest) {
  const member=await teacherOrResponse(request)
  if(isResponse(member)) return member
  try {
    const body=await request.json()
    const groupId=Number(body.groupId)
    const profileId=String(body.profileId||'').trim()
    if(!Number.isInteger(groupId)||groupId<=0||!profileId) return NextResponse.json({error:'Class and student are required.'},{status:400})
    const sql=getKoterieSql()
    await sql`DELETE FROM class_group_members WHERE group_id=${groupId} AND profile_id=${profileId}`
    return NextResponse.json({ok:true})
  } catch(error) {
    console.error('remove group member',error)
    return NextResponse.json({error:'Could not remove student from class'},{status:500})
  }
}
