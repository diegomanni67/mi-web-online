import { NextRequest, NextResponse } from 'next/server'
import { teacherOrResponse, isResponse } from '@/lib/api-auth'
import { getKoterieSql } from '@/lib/koterie-db'

const spaces = new Set(['academy','studio','all'])
const categories = new Set(['books','study-guides','audio','exam-practice','links'])
function safeUrl(value: unknown) {
  try { const url = new URL(String(value || '')); return ['https:','http:'].includes(url.protocol) ? url.toString() : '' } catch { return '' }
}

export async function GET(request: NextRequest) {
  const member = await teacherOrResponse(request); if (isResponse(member)) return member
  const sql = getKoterieSql(); const rows = await sql`SELECT * FROM materials ORDER BY active DESC, created_at DESC`
  return NextResponse.json({ materials: rows })
}

export async function POST(request: NextRequest) {
  const member = await teacherOrResponse(request); if (isResponse(member)) return member
  const body = await request.json(); const title=String(body.title||'').trim(); const description=String(body.description||'').trim()
  const space=String(body.space||'all'); const category=String(body.category||'links'); const sourceType=body.sourceType==='upload'?'upload':'link'
  if (!title || !spaces.has(space) || !categories.has(category)) return NextResponse.json({ error:'Check title, space and category' },{status:400})
  const sql=getKoterieSql()
  if (sourceType==='link') {
    const externalUrl=safeUrl(body.externalUrl); if(!externalUrl) return NextResponse.json({error:'A valid http/https link is required'},{status:400})
    const rows=await sql`INSERT INTO materials(title,description,space,category,source_type,external_url,created_by) VALUES(${title},${description||null},${space},${category},'link',${externalUrl},${member.id}) RETURNING *`
    return NextResponse.json({material:rows[0]},{status:201})
  }
  const objectKey=String(body.objectKey||'').trim(), fileName=String(body.fileName||'').trim(), mimeType=String(body.mimeType||'application/octet-stream'), size=Number(body.fileSizeBytes||0)
  if(!objectKey || !fileName || !Number.isFinite(size) || size<=0) return NextResponse.json({error:'Uploaded file metadata is incomplete'},{status:400})
  const rows=await sql`INSERT INTO materials(title,description,space,category,source_type,object_key,file_name,mime_type,file_size_bytes,created_by) VALUES(${title},${description||null},${space},${category},'upload',${objectKey},${fileName},${mimeType},${size},${member.id}) RETURNING *`
  return NextResponse.json({material:rows[0]},{status:201})
}

export async function PATCH(request: NextRequest) {
  const member=await teacherOrResponse(request); if(isResponse(member)) return member
  const body=await request.json(); const id=Number(body.id); if(!Number.isInteger(id)) return NextResponse.json({error:'Invalid material'},{status:400})
  const sql=getKoterieSql(); const active=Boolean(body.active)
  const rows=await sql`UPDATE materials SET active=${active},updated_at=now() WHERE id=${id} RETURNING *`
  if(!rows[0]) return NextResponse.json({error:'Material not found'},{status:404})
  return NextResponse.json({material:rows[0]})
}
