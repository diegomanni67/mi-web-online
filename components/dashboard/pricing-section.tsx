"use client"

import { ArrowRight, Check, Sparkles } from 'lucide-react'

const whatsappBase = 'https://wa.me/5491162991211?text='

const plans = [
  {
    name: 'Clases grupales',
    price: '$120.000',
    note: 'por mes',
    description: 'Dos horas semanales de clase en vivo, en grupo, con acceso a Koterie incluido.',
    features: ['2 horas semanales de clase', 'Práctica oral y seguimiento', 'Academy, Studio en modo lectura y comunidad', 'Actividades entre clases', 'Herramientas digitales de práctica'],
    accent: 'from-violet-600 to-purple-600',
    border: 'border-violet-500/30',
    badge: 'OPCIÓN PRINCIPAL',
  },
  {
    name: 'Clases individuales',
    price: '$200.000',
    note: 'por mes',
    description: 'Dos horas semanales 1 a 1, enfocadas en objetivos concretos, con acceso a Koterie incluido.',
    features: ['2 horas semanales 1 a 1', 'Objetivos y contenidos personalizados', 'Práctica oral intensiva', 'Comunidad y actividades', 'Herramientas digitales de práctica'],
    accent: 'from-fuchsia-600 to-pink-600',
    border: 'border-pink-500/25',
    badge: null,
  },
]

export function PricingSection() {
  function openWhatsApp(plan: string) {
    const message = `Hola Ana Laura, vi Koterie y quiero consultar por ${plan.toLowerCase()}.`
    window.open(`${whatsappBase}${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300"><Sparkles className="h-4 w-4" /> Clases + plataforma</div>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Elegí cómo querés aprender</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/50">En esta primera etapa, el acceso a Koterie está incluido sin costo adicional para quienes toman clases.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.name} className={`relative overflow-hidden rounded-[2rem] border ${plan.border} bg-white/[0.035] p-7 backdrop-blur sm:p-8`}>
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${plan.accent}`} />
            {plan.badge && <span className="mb-5 inline-flex rounded-full bg-violet-500/15 px-3 py-1.5 text-[11px] font-black tracking-[0.14em] text-violet-300">{plan.badge}</span>}
            <h3 className="text-2xl font-black">{plan.name}</h3>
            <div className="mt-5 flex items-end gap-2"><span className="text-4xl font-black sm:text-5xl">{plan.price}</span><span className="pb-1 text-sm text-white/40">{plan.note}</span></div>
            <p className="mt-4 leading-7 text-white/55">{plan.description}</p>
            <div className="mt-7 space-y-3">
              {plan.features.map((feature) => <div key={feature} className="flex items-start gap-3 text-sm font-medium text-white/75"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"><Check className="h-3.5 w-3.5" /></span>{feature}</div>)}
            </div>
            <button onClick={() => openWhatsApp(plan.name)} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${plan.accent} px-6 py-4 font-black transition hover:brightness-110`}>Consultar esta modalidad <ArrowRight className="h-4 w-4" /></button>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 text-center sm:p-7">
        <p className="font-bold">¿Solo querés usar la plataforma?</p>
        <p className="mt-2 text-sm leading-6 text-white/45">Esa modalidad está contemplada, pero todavía no tiene un precio definido. No vamos a publicar un valor hasta que Ana Laura y Cintia cierren la propuesta.</p>
      </div>
    </div>
  )
}
