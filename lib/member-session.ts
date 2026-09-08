import { createHmac, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

export const SESSION_COOKIE = 'koterie_session'

export type MemberAccess = 'academy' | 'studio'
export type MemberRole = 'student' | 'teacher' | 'admin'
export type MemberSession = {
  id: string
  name: string
  email: string
  access: MemberAccess
  role: MemberRole
  exp: number
}

function encode(value: string) {
  return Buffer.from(value).toString('base64url')
}
function decode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}
function secret() {
  const value = process.env.KOTERIE_SESSION_SECRET
  if (!value || value.length < 32) throw new Error('KOTERIE_SESSION_SECRET must contain at least 32 characters')
  return value
}

export function safeCodeEquals(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function createMemberToken(session: Omit<MemberSession, 'exp'>, days = 30) {
  const payload: MemberSession = { ...session, exp: Date.now() + days * 86400000 }
  const body = encode(JSON.stringify(payload))
  const signature = createHmac('sha256', secret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

export function verifyMemberToken(token?: string | null): MemberSession | null {
  if (!token) return null
  const [body, suppliedSignature] = token.split('.')
  if (!body || !suppliedSignature) return null
  const expected = createHmac('sha256', secret()).update(body).digest('base64url')
  if (!safeCodeEquals(suppliedSignature, expected)) return null
  try {
    const session = JSON.parse(decode(body)) as MemberSession
    if (!session.id || !session.name || !session.email || !['academy', 'studio'].includes(session.access) || !['student', 'teacher', 'admin'].includes(session.role) || session.exp < Date.now()) return null
    return session
  } catch {
    return null
  }
}

export function getMemberFromRequest(request: NextRequest) {
  return verifyMemberToken(request.cookies.get(SESSION_COOKIE)?.value)
}

export function canWriteSpace(member: MemberSession, space: MemberAccess) {
  return member.role !== 'student' || space === 'academy' || member.access === 'studio'
}

export function isTeacher(member: MemberSession | null) { return !!member && (member.role === 'teacher' || member.role === 'admin') }
