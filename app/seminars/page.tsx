"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

const WHATSAPP_URL = "https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20quer%C3%ADa%20consultar%20por%20los%20seminarios%20de%20Koterie."

const FALLBACK_IDEA = {
  id: "gothic-literature",
  title: "Gothic Literature: Fear, Doubles & the Uncanny",
  description:
    "A future seminar, fully in English, exploring the Gothic tradition through atmosphere, fear, doubles, unreliable voices and the uncanny. Designed as an advanced discussion space around literature and interpretation.",
  level: "B2-C2",
  label: "In planning",
}

type Seminar = {
  id: string
  title: string
  description: string
  level: string
  startsAt: string
  durationMinutes: number
  priceArs: number | null
  teacherName: string | null
  capacity: number | null
  registrationOpen: boolean
  registrationNote: string | null
  confirmedCount: number
}

type Idea = {
  id: string
  title: string
  description: string
  level: string
  label: string
}

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<Seminar[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([FALLBACK_IDEA])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [registering, setRegistering] = useState<string | null>(null)
  const [formFor, setFormFor] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("es-AR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "America/Argentina/Buenos_Aires",
      }),
    [],
  )

  async function load() {
    setLoading(true)
    setLoadError(false)
    try {
      const response = await fetch("/api/seminars", { cache: "no-store" })
      if (!response.ok) throw new Error("seminars")
      const data = await response.json()
      setSeminars(Array.isArray(data.seminars) ? data.seminars : [])
      const realIdeas = Array.isArray(data.ideas) ? data.ideas : []
      setIdeas(realIdeas.length ? realIdeas : [FALLBACK_IDEA])
    } catch {
      setSeminars([])
      setIdeas([FALLBACK_IDEA])
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function register(seminarId: string) {
    if (!name.trim() || !email.trim()) {
      setMessage({ type: "error", text: "Completá tu nombre y email." })
      return
    }
    setRegistering(seminarId)
    setMessage(null)
    try {
      const response = await fetch("/api/seminars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seminarId, name: name.trim(), email: email.trim() }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "No pudimos registrar tu interés.")
      const statusText =
        data.status === "waitlist"
          ? "Quedaste en lista de espera. Te avisaremos si se libera un lugar."
          : data.alreadyRegistered
            ? "Ya estabas registrado/a para este seminario."
            : "Recibimos tu inscripción. La confirmación del lugar se gestiona desde Koterie."
      setMessage({ type: "ok", text: statusText })
      setFormFor(null)
      await load()
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "No pudimos registrar tu interés." })
    } finally {
      setRegistering(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <section className="border-b border-white/[0.06] bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,.20),transparent_38%),radial-gradient(circle_at_top_right,rgba(236,72,153,.13),transparent_32%)]">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Koterie Seminars</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">English beyond the weekly class.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Encuentros especiales, principalmente para niveles avanzados, dictados en inglés y abiertos también a personas que no sean alumnas regulares de Koterie.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-bold transition hover:bg-violet-500">
              Consultar por WhatsApp
            </a>
            <Link href="/" className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-bold text-white/75 transition hover:bg-white/[0.08] hover:text-white">
              Volver a Koterie
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Confirmed seminars</p>
          <h2 className="mt-2 text-3xl font-bold">Próximos seminarios</h2>
          <p className="mt-2 text-white/45">Solo aparecen acá cuando fecha, modalidad y publicación están realmente confirmadas.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-white/50">Cargando seminarios…</div>
        ) : seminars.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10">
            <div className="text-sm font-bold text-white">Todavía no hay ningún seminario confirmado.</div>
            <p className="mt-2 max-w-2xl leading-7 text-white/48">Cuando haya fecha real, docente, duración, cupos y precio definidos, aparecerá en esta sección con su inscripción correspondiente.</p>
            {loadError && <button onClick={() => void load()} className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/[0.1]">Reintentar conexión</button>}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {seminars.map((seminar) => {
              const full = seminar.capacity !== null && seminar.confirmedCount >= seminar.capacity
              return (
                <article key={seminar.id} className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-violet-300">{seminar.level}</span>
                    {seminar.teacherName && <span className="rounded-full bg-white/[0.06] px-3 py-1 text-white/55">{seminar.teacherName}</span>}
                  </div>
                  <h3 className="mt-5 text-2xl font-bold">{seminar.title}</h3>
                  <p className="mt-3 leading-7 text-white/55">{seminar.description}</p>
                  <div className="mt-5 space-y-1 text-sm text-white/55">
                    <div>{formatter.format(new Date(seminar.startsAt))}</div>
                    <div>{seminar.durationMinutes} minutos</div>
                    <div>{seminar.priceArs === null ? "Precio a confirmar" : `$${seminar.priceArs.toLocaleString("es-AR")} ARS`}</div>
                    {seminar.capacity !== null && <div>{seminar.confirmedCount}/{seminar.capacity} lugares confirmados</div>}
                  </div>
                  {seminar.registrationNote && <p className="mt-4 rounded-xl bg-white/[0.04] p-3 text-sm text-white/50">{seminar.registrationNote}</p>}

                  {formFor === seminar.id ? (
                    <div className="mt-6 space-y-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base outline-none focus:border-violet-400/50" />
                      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base outline-none focus:border-violet-400/50" />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button disabled={registering === seminar.id} onClick={() => void register(seminar.id)} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold disabled:opacity-50">{registering === seminar.id ? "Enviando…" : full ? "Entrar a lista de espera" : "Enviar inscripción"}</button>
                        <button onClick={() => setFormFor(null)} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/60">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <button disabled={!seminar.registrationOpen} onClick={() => { setMessage(null); setFormFor(seminar.id) }} className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
                      {seminar.registrationOpen ? (full ? "Lista de espera" : "Inscribirme") : "Inscripción cerrada"}
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        )}

        {message && (
          <div className={`mt-5 rounded-2xl border p-4 text-sm ${message.type === "ok" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100" : "border-red-500/25 bg-red-500/10 text-red-100"}`}>
            {message.text}
          </div>
        )}
      </section>

      <section className="border-t border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-300">Ideas for the future</p>
          <h2 className="mt-2 text-3xl font-bold">En planificación</h2>
          <p className="mt-2 max-w-2xl text-white/45">Estas ideas no son anuncios ni fechas confirmadas. Son líneas de trabajo que Koterie podría desarrollar más adelante.</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {ideas.map((idea) => (
              <article key={idea.id} className="overflow-hidden rounded-3xl border border-fuchsia-400/15 bg-gradient-to-br from-fuchsia-500/[0.08] to-violet-500/[0.05] p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-fuchsia-300">{idea.label || "In planning"}</span>
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/55">{idea.level}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold">{idea.title}</h3>
                <p className="mt-3 leading-7 text-white/55">{idea.description}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-white/30">Sin fecha · sin precio · no confirmado</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
