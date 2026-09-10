import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'koterie_session'

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - normalized.length % 4) % 4)
  return atob(normalized + padding)
}

async function validSession(token: string | undefined) {
  const secret = process.env.KOTERIE_SESSION_SECRET
  if (!secret || secret.length < 32 || !token) return false
  const [body, signature] = token.split('.')
  if (!body || !signature) return false

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const sigBytes = Uint8Array.from(decodeBase64Url(signature), (char) => char.charCodeAt(0))
  const ok = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(body))
  if (!ok) return false

  try {
    const payload = JSON.parse(decodeBase64Url(body)) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  if (await validSession(request.cookies.get(COOKIE)?.value)) return NextResponse.next()
  const login = new URL('/login', request.url)
  login.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/dashboard/:path*', '/forum/:path*', '/academy-forum/:path*', '/studio-forum/:path*', '/practice/:path*', '/community/:path*', '/profile/:path*', '/admin/:path*'],
}
