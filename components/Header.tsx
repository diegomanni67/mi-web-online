"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { User, Bell, Menu, X } from 'lucide-react'

export function Header() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-blue-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/koterie-logo-transparent.png" 
              alt="Koterie Language Studio" 
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#academy" className="text-white/50 hover:text-white transition-colors">Academy</Link>
            <Link href="#community" className="text-white/50 hover:text-white transition-colors">Comunidad</Link>
            <Link href="#pricing" className="text-white/50 hover:text-white transition-colors">Precios</Link>
          </nav>

          {/* User Actions - VERSIÓN LOCAL ABIERTA */}
          <div className="flex items-center gap-3">
            <Link href="/auth" className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-slate-900 hover:bg-gray-100 transition-colors font-semibold">
              <span className="hidden sm:inline">Inscribirse</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-2xl bg-blue-800/50 text-blue-100 hover:bg-blue-700/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/90 backdrop-blur-md border-t border-blue-800/50">
          <div className="px-4 py-3 space-y-2">
            <Link href="#academy" className="block px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-blue-800/30">Academy</Link>
            <Link href="#community" className="block px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-blue-800/30">Comunidad</Link>
            <Link href="#pricing" className="block px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-blue-800/30">Precios</Link>
          </div>
        </div>
      )}
    </header>
  )
}
