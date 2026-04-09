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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
              <span className="text-lg font-bold text-white">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Koterie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#academy" className="text-gray-600 hover:text-gray-900 transition-colors">Academy</Link>
            <Link href="/studio" className="text-gray-600 hover:text-gray-900 transition-colors">Studio</Link>
            <Link href="#community" className="text-gray-600 hover:text-gray-900 transition-colors">Comunidad</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Precios</Link>
          </nav>

          {/* User Actions - VERSIÓN LOCAL ABIERTA */}
          <div className="flex items-center gap-3">
            <Link href="/community" className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-colors">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Comunidad</span>
            </Link>
            <Link href="/academy-forum" className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              <span className="hidden sm:inline">Foros</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200/50">
          <div className="px-4 py-3 space-y-2">
            <Link href="#academy" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100">Academy</Link>
            <Link href="/studio" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100">Studio</Link>
            <Link href="#community" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100">Comunidad</Link>
            <Link href="#pricing" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100">Precios</Link>
          </div>
        </div>
      )}
    </header>
  )
}
