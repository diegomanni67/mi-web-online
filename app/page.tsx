"use client"

import Link from 'next/link'
import { HeroCards } from '@/components/dashboard/hero-cards'
import { PricingSection } from '@/components/dashboard/pricing-section'
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  Film,
  MessageCircle,
  Mic2,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'

const whatsapp = 'https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20vi%20Koterie%20y%20quiero%20consultar%20por%20las%20clases%20de%20ingl%C3%A9s.'

const platformFeatures = [
  {
    icon: MessageCircle,
    title: 'Comunidad',
    text: 'Conversaciones, preguntas, temas compartidos y espacios para usar inglés con otros alumnos.',
  },
  {
    icon: Bot,
    title: 'Práctica con IA',
    text: 'Conversación, ejercicios y correcciones para seguir practicando entre una clase y la siguiente.',
  },
  {
    icon: Mic2,
    title: 'Speaking',
    text: 'Actividades orientadas a perder el miedo a hablar, ganar fluidez y usar el idioma de forma natural.',
  },
  {
    icon: Film,
    title: 'Inglés fuera del aula',
    text: 'Películas, series, debates, desafíos y propuestas para llevar el idioma a situaciones reales.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <main>
        <section id="hero" className="relative overflow-hidden border-b border-white/[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.16),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300">
                <Sparkles className="h-4 w-4" /> Clases en vivo + práctica toda la semana
              </div>
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
                Aprendé inglés y <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">seguí usándolo</span> cuando termina la clase.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55 sm:text-xl">
                Koterie combina clases con profesoras reales, comunidad, actividades y herramientas de inteligencia artificial para que el inglés forme parte de tu semana y no solamente de una videollamada.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-4 font-bold text-white shadow-xl shadow-purple-500/20 transition hover:from-violet-500 hover:to-purple-500">
                  Quiero consultar <ArrowRight className="h-5 w-5" />
                </a>
                <Link href="#pricing" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white/85 backdrop-blur transition hover:bg-white/10 hover:text-white">
                  Ver modalidades
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/55">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> 2 horas semanales</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> Online</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> Plataforma incluida</span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />
              <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
                <img src="/isologo-premium.png" alt="Koterie Language Studio" className="mx-auto w-full max-w-[360px] rounded-3xl" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.06] p-4">
                    <Video className="h-5 w-5 text-blue-300" />
                    <p className="mt-3 font-bold">Clases en vivo</p>
                    <p className="mt-1 text-sm leading-6 text-white/45">Grupales o individuales.</p>
                  </div>
                  <div className="rounded-2xl border border-fuchsia-500/15 bg-fuchsia-500/[0.06] p-4">
                    <BrainCircuit className="h-5 w-5 text-fuchsia-300" />
                    <p className="mt-3 font-bold">Koterie entre clases</p>
                    <p className="mt-1 text-sm leading-6 text-white/45">IA, comunidad y práctica.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="spaces" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">Dos espacios, una misma comunidad</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Academy y Studio conservan la identidad original de Koterie.</h2>
            <p className="mt-4 text-lg leading-8 text-white/50">
              No son dos plataformas separadas. Academy acompaña a quienes todavía están consolidando su inglés; Studio propone una experiencia más exigente para niveles avanzados. La idea es que los alumnos puedan crecer dentro de la misma comunidad.
            </p>
          </div>
          <HeroCards />
        </section>

        <section id="platform" className="border-y border-white/[0.05] bg-white/[0.018] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-purple-300">La diferencia de Koterie</p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">La clase es el comienzo, no el final.</h2>
                <p className="mt-5 text-lg leading-8 text-white/50">
                  El objetivo de la plataforma es que tengas motivos reales para volver, hablar, escribir, escuchar y practicar durante toda la semana.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {platformFeatures.map(({ icon: Icon, title, text }) => (
                  <article key={title} className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 transition hover:border-purple-400/20 hover:bg-white/[0.045]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-purple-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{title}</h3>
                    <p className="mt-3 leading-7 text-white/48">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
              <div className="rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-blue-950/70 to-slate-950 p-8 sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300"><Users className="h-6 w-6" /></div>
                <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Una comunidad para aprender con otros.</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/50">
                  La comunidad no reemplaza a las profesoras. Suma oportunidades para preguntar, conversar, compartir intereses y exponerte al idioma más veces durante la semana.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/academy-forum" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-bold text-white transition hover:bg-blue-400">Entrar a Academy <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/studio-forum" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Conocer Studio</Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-950/55 to-slate-950 p-8 sm:p-10">
                <MessageCircle className="h-8 w-8 text-purple-300" />
                <h3 className="mt-6 text-2xl font-bold">También hay un espacio de conversación externo.</h3>
                <p className="mt-4 leading-7 text-white/50">
                  Discord puede servir para encuentros informales, conversaciones y actividades puntuales mientras la comunidad interna de Koterie sigue evolucionando.
                </p>
                <a href="https://discord.gg/5EaYtrz7R7" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 font-bold text-purple-300 transition hover:text-white">
                  Ir al Discord <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-white/[0.05] bg-white/[0.018] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingSection />
          </div>
        </section>

        <section id="seminars" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-amber-400/15 bg-gradient-to-br from-amber-500/[0.08] via-white/[0.025] to-purple-500/[0.06] p-8 sm:p-10 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                    <CalendarDays className="h-4 w-4" /> Seminarios Koterie
                  </div>
                  <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">Encuentros especiales, completamente en inglés.</h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-white/50">
                    Los seminarios serán productos independientes para niveles avanzados y podrán abrirse también a personas que no tomen clases regulares. Cuando haya uno confirmado, acá aparecerán tema, fecha, docente, precio y reserva.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-slate-950/50 px-6 py-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Estado</p>
                  <p className="mt-2 font-bold text-white">Próximamente</p>
                  <p className="mt-1 text-sm text-white/40">Sin eventos ficticios</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 px-6 py-12 text-center shadow-2xl shadow-purple-950/30 sm:px-12 sm:py-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">¿Querés saber qué opción te conviene?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/75">Escribile directamente a Ana Laura y contale tu nivel, tu objetivo y qué horarios tenés disponibles.</p>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-purple-700 transition hover:bg-purple-50">
              Hablar por WhatsApp <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] bg-[#070b16] py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
          <div>
            <img src="/koterie-logo-transparent.png" alt="Koterie Language Studio" className="h-20 w-auto" />
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">Clases reales, práctica continua y comunidad para usar inglés de verdad.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/40">
            <Link href="#pricing" className="hover:text-white">Clases</Link>
            <Link href="#platform" className="hover:text-white">Plataforma</Link>
            <Link href="#community" className="hover:text-white">Comunidad</Link>
            <Link href="#seminars" className="hover:text-white">Seminarios</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
