"use client"

import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  CalendarDays,
  GraduationCap,
  MessageCircle,
  Mic2,
  Rocket,
  Sparkles,
  Video,
} from 'lucide-react'

const whatsapp = 'https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20soy%20alumno%2Fa%20de%20Koterie%20y%20quiero%20consultar%20por%20mi%20pr%C3%B3xima%20clase.'

const weeklyMission = {
  title: 'One thing I changed my mind about',
  prompt: 'Explain something you used to think differently about. What changed your opinion, and what do you think now?',
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-purple-300"><Sparkles className="h-4 w-4" /> Área de alumnos</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Welcome to Koterie.</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-white/50">Tu clase en vivo es una parte del proceso. Acá podés seguir practicando, participar de la comunidad y mantener el inglés activo durante la semana.</p>
          </div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
            <MessageCircle className="h-4 w-4" /> Consultar a Ana Laura
          </a>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <article className="overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-950/65 via-slate-950 to-slate-950 p-7 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">Misión de la semana</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold">{weeklyMission.title}</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">{weeklyMission.prompt}</p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><Mic2 className="h-7 w-7" /></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/practice" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-500">Practicar con IA <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/academy-forum" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Compartir en Academy</Link>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300"><CalendarDays className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/30">Próxima clase</p>
                <h2 className="mt-1 text-xl font-bold">Horario de tu grupo</h2>
              </div>
            </div>
            <p className="mt-5 leading-7 text-white/48">Todavía no mostramos horarios inventados. Cuando cada grupo quede cargado, este bloque va a mostrar día, hora, profesora y enlace de clase.</p>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white">Consultar mi horario <ArrowRight className="h-4 w-4" /></a>
          </article>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/academy-forum" className="group rounded-3xl border border-blue-500/15 bg-blue-500/[0.045] p-6 transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-500/[0.07]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300"><GraduationCap className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-bold">Academy</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">Preguntas, práctica guiada y comunidad para seguir creciendo.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300">Entrar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>

          <Link href="/studio-forum" className="group rounded-3xl border border-pink-500/15 bg-pink-500/[0.045] p-6 transition hover:-translate-y-1 hover:border-pink-400/30 hover:bg-pink-500/[0.07]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-300"><Rocket className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-bold">Studio</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">Conversación y producción para alumnos de nivel avanzado.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-pink-300">Entrar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>

          <Link href="/practice" className="group rounded-3xl border border-purple-500/15 bg-purple-500/[0.045] p-6 transition hover:-translate-y-1 hover:border-purple-400/30 hover:bg-purple-500/[0.07]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><Bot className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-bold">Koterie AI</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">Escribí, hablá, escuchá respuestas y pedí correcciones.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-300">Practicar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>

          <a href="https://discord.gg/5EaYtrz7R7" target="_blank" rel="noopener noreferrer" className="group rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.04] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-500/[0.065]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"><MessageCircle className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-bold">Discord</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">Conversaciones informales y encuentros de la comunidad.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-300">Abrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </a>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8">
            <div className="flex items-center gap-3"><Video className="h-5 w-5 text-sky-300" /><h2 className="text-xl font-bold">Clases en vivo</h2></div>
            <p className="mt-4 leading-7 text-white/48">En la próxima etapa, cada alumno va a ver acá su grupo, profesora, próxima clase y enlace de acceso. Preferimos dejar el bloque preparado antes que rellenarlo con información ficticia.</p>
          </article>
          <article className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8">
            <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-amber-300" /><h2 className="text-xl font-bold">Seminarios</h2></div>
            <p className="mt-4 leading-7 text-white/48">Cuando haya un seminario confirmado aparecerá en este espacio con tema, nivel, fecha, precio y forma de reserva. Las grabaciones se podrán integrar después.</p>
          </article>
        </section>
      </div>
    </main>
  )
}
