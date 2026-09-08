"use client"

import { useState } from 'react'
import Link from 'next/link'
import { LogIn, LogOut, Menu, MessageCircle, Settings, X } from 'lucide-react'
import { useMember } from '@/components/member/useMember'

const whatsapp = 'https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20vi%20Koterie%20y%20quiero%20consultar%20por%20las%20clases%20de%20ingl%C3%A9s.'
const links = [
  ['Clases', '/#pricing'],
  ['Plataforma', '/#platform'],
  ['Comunidad', '/#community'],
  ['Seminarios', '/seminars'],
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { member } = useMember()
  const studentHref = member ? '/dashboard' : '/login'
  const studentLabel = member ? 'Mi Koterie' : 'Área alumnos'
  const isTeacher = member?.role === 'teacher' || member?.role === 'admin'

  async function logout() {
    if (loggingOut) return
    setLoggingOut(true)
    try { await fetch('/api/member/logout', { method: 'POST' }) } finally { window.location.href = '/' }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-800/40 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[72px]">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center transition-opacity hover:opacity-85"><img src="/koterie-logo-transparent.png" alt="Koterie Language Studio" className="h-12 w-auto sm:h-14" /></Link>
          <nav className="hidden items-center gap-7 lg:flex">{links.map(([label,href]) => <Link key={label} href={href} className="text-sm font-medium text-white/55 transition hover:text-white">{label}</Link>)}</nav>
          <div className="flex items-center gap-2">
            {isTeacher && <Link href="/admin" className="hidden items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] px-3 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/10 xl:flex"><Settings className="h-4 w-4" /> Administrar</Link>}
            <Link href={studentHref} className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 sm:flex"><LogIn className="h-4 w-4" /> {studentLabel}</Link>
            {member && <button onClick={logout} disabled={loggingOut} className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/45 transition hover:bg-white/10 hover:text-white disabled:opacity-40 md:flex" aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></button>}
            <a href={whatsapp} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-bold shadow-lg shadow-purple-500/15 md:flex"><MessageCircle className="h-4 w-4" /> Consultar</a>
            <button onClick={() => setOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-100 lg:hidden" aria-label="Abrir menú">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
      </div>
      {open && <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden"><nav className="mx-auto grid max-w-7xl gap-1">{links.map(([label,href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium text-white/70 hover:bg-white/5 hover:text-white">{label}</Link>)}{isTeacher && <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 font-semibold text-amber-200 hover:bg-amber-400/[0.06]"><Settings className="h-4 w-4" /> Administrar Koterie</Link>}<div className="mt-2 grid gap-2 sm:grid-cols-2"><Link href={studentHref} onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold"><LogIn className="h-4 w-4" /> {studentLabel}</Link><a href={whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-bold"><MessageCircle className="h-4 w-4" /> WhatsApp</a></div>{member && <button onClick={logout} disabled={loggingOut} className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/55 hover:text-white"><LogOut className="h-4 w-4" /> Cerrar sesión</button>}</nav></div>}
    </header>
  )
}
