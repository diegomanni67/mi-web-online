"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HeroCards } from '@/components/dashboard/hero-cards'
import { PricingSection } from '@/components/dashboard/pricing-section'
import { GraduationCap, Rocket, Users, ArrowRight, User, MessageCircle, Star } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const handleCardClick = (destination: string) => {
    // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
    router.push(destination)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col justify-center">

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Logo */}
          <img 
            src="/isologo-premium.png" 
            alt="Koterie Language Studio Premium" 
            className="w-[300px] h-auto rounded-3xl drop-shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-8"
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-8">
            <span className="text-purple-300 text-sm font-medium">Club premium de idiomas</span>
          </div>

          {/* H1 with gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Tu inglés,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              al siguiente nivel
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/50 max-w-2xl mb-10">
            Únete a la comunidad más exclusiva de aprendizaje de inglés. Practica, conecta y crece con estudiantes de todo el mundo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25">
              Empezar ahora
            </button>
            <button className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
              Conocer más
            </button>
          </div>
        </div>
      </section>

      {/* Hero Cards */}
      <section id="academy" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        <HeroCards />
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Únete a nuestra comunidad
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Conecta con otros estudiantes y comparte tu progreso
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Community Features Cards */}
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Comunidad Activa</h3>
                  <p className="mt-1 text-white/50">Aprende junto a otros estudiantes</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Salas de Voz</h3>
                  <p className="mt-1 text-white/50">Practica tu inglés en tiempo real</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-300">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Eventos Exclusivos</h3>
                  <p className="mt-1 text-white/50">Seminarios y workshops mensuales</p>
                </div>
              </div>
            </div>

            {/* Discord CTA */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-8 text-white">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Únete a nuestro Discord</h3>
                <p className="mb-6 text-white/60">
                  La comunidad más activa de aprendizaje de inglés. Chatea, participa en eventos y encuentra compañeros de estudio.
                </p>
                <a
                  href="https://discord.gg/5EaYtrz7R7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Unirse a Discord
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <div className="mb-4">
                <span className="text-xl font-bold">Koterie Language Studio</span>
              </div>
              <p className="text-gray-400">
                Tu club social premium de idiomas
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">Aprender</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#academy" className="hover:text-white transition-colors">Academy</Link></li>
                <li><Link href="#studio" className="hover:text-white transition-colors">Studio</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Precios</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">Comunidad</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#community" className="hover:text-white transition-colors">Miembros</Link></li>
                <li><a href="https://discord.gg/5EaYtrz7R7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Eventos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Términos</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 Koterie Language Studio. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
