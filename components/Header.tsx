"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MessageCircle, LogIn } from 'lucide-react'

const whatsapp = 'https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20vi%20Koterie%20y%20quiero%20consultar%20por%20las%20clases%20de%20ingl%C3%A9s.'

const links = [
  ['Clases', '/#pricing'],
  ['Plataforma', '/#platform'],
  ['Comunidad', '/#community'],
  ['Seminarios', '/#seminars'],
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-blue-800/40 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 transition-opacity hover:opacity-85">
            <img src="/koterie-logo-transparent.png" alt="Koterie Language Studio" className="h-20 w-auto" />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([label, href]) => (
              <Link key={label} href={href} className="text-sm font-medium text-white/55 transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white sm:flex">
              <LogIn className="h-4 w-4" /> Área alumnos
            </Link>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/15 transition hover:from-violet-500 hover:to-purple-500 md:flex">
              <MessageCircle className="h-4 w-4" /> Consultar
            </a>
            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-blue-100 transition hover:bg-white/10 lg:hidden"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {links.map(([label, href]) => (
              <Link key={label} href={href} onClick={closeMenu} className="rounded-xl px-3 py-3 font-medium text-white/70 hover:bg-white/5 hover:text-white">
                {label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Link href="/dashboard" onClick={closeMenu} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
                <LogIn className="h-4 w-4" /> Área alumnos
              </Link>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-bold text-white">
                <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
