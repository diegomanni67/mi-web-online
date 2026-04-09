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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-16">

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
                <span className="text-2xl font-bold text-white">K</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Koterie Language Studio
              </h1>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Tu club social premium de idiomas. Academy para crecimiento, Studio para maestría.
            </p>
            <div className="mx-auto mt-10 flex max-w-md justify-center gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>4.2k miembros</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>2 niveles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Rocket className="h-4 w-4" />
                <span>USD 80/mes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Cards */}
      <section id="academy" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Elige tu camino
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comienza donde estás y llega hasta donde quieras
          </p>
        </div>
        
        <HeroCards />
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Únete a nuestra comunidad
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Conecta con otros estudiantes y comparte tu progreso
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Community Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Comunidad Activa</h3>
                  <p className="mt-1 text-gray-600">Más de 4,000 estudiantes aprendiendo juntos</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Salas de Voz</h3>
                  <p className="mt-1 text-gray-600">Practica tu inglés en tiempo real</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Eventos Exclusivos</h3>
                  <p className="mt-1 text-gray-600">Seminarios y workshops mensuales</p>
                </div>
              </div>
            </div>

            {/* Discord CTA */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Únete a nuestro Discord</h3>
                <p className="mb-6 text-purple-100">
                  La comunidad más activa de aprendizaje de inglés. Chatea, participa en eventos y encuentra compañeros de estudio.
                </p>
                <a
                  href="https://discord.gg/koterie"
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
      <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600">
                  <span className="text-lg font-bold text-white">K</span>
                </div>
                <span className="text-xl font-bold">Koterie</span>
              </div>
              <p className="text-gray-400">
                Tu club social premium de idiomas
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Aprender</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#academy" className="hover:text-white transition-colors">Academy</Link></li>
                <li><Link href="#studio" className="hover:text-white transition-colors">Studio</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Precios</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Comunidad</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#community" className="hover:text-white transition-colors">Miembros</Link></li>
                <li><a href="https://discord.gg/koterie" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Eventos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Términos</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Koterie Language Studio. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
