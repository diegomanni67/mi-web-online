"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, GraduationCap, MessageCircle, Mic, Rocket, Sparkles } from 'lucide-react'

type Card = {
  key: 'academy' | 'studio'
  title: string
  levels: string
  tagline: string
  description: string
  href: string
  image: string
  accent: string
  icon: any
  points: string[]
}

const cards: Card[] = [
  {
    key: 'academy',
    title: 'Academy',
    levels: 'A1 · A2 · B1',
    tagline: 'Aprender, practicar y ganar confianza',
    description: 'El espacio para consolidar bases, hacer preguntas y usar el inglés sin presión. Los miembros de Academy también pueden entrar a Studio para leer conversaciones más avanzadas.',
    href: '/academy-forum',
    image: '/images/academy-social.jpg',
    accent: 'from-blue-500 to-indigo-600',
    icon: GraduationCap,
    points: ['Practice', 'Community', 'Vocabulary'],
  },
  {
    key: 'studio',
    title: 'Studio',
    levels: 'B2 · C1 · C2',
    tagline: 'Fluidez, ideas y conversación avanzada',
    description: 'Un espacio para desarrollar argumentos, conversar con mayor profundidad y ayudar también a quienes están creciendo dentro de Academy.',
    href: '/studio-forum',
    image: '/images/studio-social.jpg',
    accent: 'from-fuchsia-500 to-pink-600',
    icon: Rocket,
    points: ['Fluency', 'Debate', 'Real-world English'],
  },
]

export function HeroCards() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon
        const active = hovered === card.key
        return (
          <button
            key={card.key}
            onClick={() => router.push(card.href)}
            onMouseEnter={() => setHovered(card.key)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative min-h-[430px] overflow-hidden rounded-[2rem] border bg-white/[0.03] text-left transition duration-500 ${active ? 'border-white/20 -translate-y-1 shadow-2xl shadow-black/25' : 'border-white/[0.08]'}`}
          >
            <div className="absolute inset-x-0 top-0 h-48 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${card.image})` }} />
            <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-black/5" />
            <div className="relative flex min-h-[430px] flex-col p-6 sm:p-7">
              <span className="w-fit rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur">{card.levels}</span>
              <div className="mt-auto">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}><Icon className="h-6 w-6" /></div>
                    <div><h3 className="text-3xl font-black">{card.title}</h3><p className="mt-0.5 text-xs font-bold uppercase tracking-[0.13em] text-white/35">{card.tagline}</p></div>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/45 transition group-hover:bg-white/10 group-hover:text-white"><ArrowRight className="h-4 w-4" /></span>
                </div>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">{card.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.points.map((point, index) => (
                    <span key={point} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60">
                      {index === 0 ? <Sparkles className="h-3 w-3" /> : index === 1 ? <MessageCircle className="h-3 w-3" /> : <Mic className="h-3 w-3" />}{point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
