"use client"

import { ArrowRight, Check, Sparkles } from "lucide-react"

const whatsappBase = 'https://wa.me/5491162991211?text='

const plans = [
  {
    name: 'Clases grupales',
    price: '$120.000',
    note: 'por mes',
    description: 'Dos horas semanales de clase en vivo, en grupo, con acceso completo a Koterie incluido.',
    features: [
      '2 horas semanales de clase',
      'Práctica oral y seguimiento',
      'Acceso a Academy y comunidad',
      'Actividades entre clases',
      'Herramientas de práctica con IA',
    ],
    accent: 'from-violet-600 to-purple-600',
    border: 'border-violet-500/30',
    badge: 'OPCIÓN PRINCIPAL',
  },
  {
    name: 'Clases individuales',
    price: '$200.000',
    note: 'por mes',
    description: 'Dos horas semanales 1 a 1, enfocadas en tus objetivos, con acceso completo a Koterie.',
    features: [
      '2 horas semanales 1 a 1',
      'Objetivos y contenidos personalizados',
      'Práctica oral intensiva',
      'Acceso a comunidad y actividades',
      'Herramientas de práctica con IA',
    ],
    accent: 'from-fuchsia-600 to-pink-600',
    border: 'border-pink-500/25',
    badge: null,
  },
]

export function PricingSection() {
  const openWhatsApp = (plan: string) => {
    const message = `Hola Ana Laura, vi Koterie y quiero consultar por ${plan.toLowerCase()}.`;
    window.open(`${whatsappBase}${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300">
          <Sparkles className="h-4 w-4" /> Clases + plataforma
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Elegí cómo querés aprender</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
          El acceso a Koterie está incluido en ambas modalidades, sin costo extra para los alumnos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.name} className={`relative overflow-hidden rounded-3xl border ${plan.border} bg-white/[0.035] p-7 backdrop-blur sm:p-8`}>
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${plan.accent}`} />
            {plan.badge && (
              <span className="mb-5 inline-flex rounded-full bg-violet-500/15 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-violet-300">
                {plan.badge}
              </span>
            )}
            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-extrabold text-white sm:text-5xl">{plan.price}</span>
              <span className="pb-1 text-sm text-white/40">{plan.note}</span>
            </div>
            <p className="mt-4 max-w-xl leading-7 text-white/55">{plan.description}</p>

            <div className="mt-7 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm font-medium text-white/75">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => openWhatsApp(plan.name)}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${plan.accent} px-6 py-4 font-bold text-white shadow-lg transition hover:brightness-110`}
            >
              Consultar esta modalidad <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 text-center sm:p-7">
        <p className="font-semibold text-white">¿Solo querés usar la plataforma?</p>
        <p className="mt-2 text-sm leading-6 text-white/45">
          Estamos preparando una modalidad sin clases en vivo. El precio todavía no está definido, por eso preferimos no publicar uno hasta cerrarlo.
        </p>
      </div>
    </div>
  )
}
