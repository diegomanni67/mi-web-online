"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  GraduationCap,
  Rocket,
  BookOpenCheck,
  Languages,
  Mic,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroCardProps {
  title: string
  tagline: string
  description: string
  levels: string
  features: { icon: React.ElementType; label: string }[]
  imageSrc: string
  icon: React.ElementType
  variant: "academy" | "studio"
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick?: () => void
}

function HeroCard({
  title,
  tagline,
  description,
  levels,
  features,
  imageSrc,
  icon: Icon,
  variant,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: HeroCardProps) {
  const isAcademy = variant === "academy"

  return (
    <button
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl text-left transition-all duration-500 ease-out",
        "bg-white/[0.03] border border-white/[0.08]",
        isHovered ? "scale-[1.02] border-white/[0.15] shadow-2xl shadow-black/20" : ""
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="relative h-36 overflow-hidden sm:h-44">
        <Image
          src={imageSrc}
          alt={`${title} - Koterie`}
          fill
          className={cn("object-cover transition-all duration-700 ease-out", isHovered ? "scale-110 brightness-105" : "scale-100")}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className={cn(
            "flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md",
            isAcademy ? "border-blue-400/30 bg-blue-500/25" : "border-pink-400/30 bg-pink-500/25"
          )}>
            <Icon className="size-3" /> {levels}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex size-11 items-center justify-center rounded-2xl",
              isAcademy
                ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                : "bg-gradient-to-br from-fuchsia-500 to-pink-600"
            )}>
              <Icon className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-white">{title}</h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{tagline}</p>
            </div>
          </div>
          <div className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            isHovered ? (isAcademy ? "bg-blue-500 text-white" : "bg-pink-500 text-white") : "bg-white/5 text-white/50"
          )}>
            <ArrowRight className={cn("size-4 transition-transform duration-300", isHovered && "translate-x-0.5")} />
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">{description}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {features.map((feature) => (
            <span key={feature.label} className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-white/70">
              <feature.icon className="size-3 shrink-0 text-white/45" />
              {feature.label}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

export function HeroCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <HeroCard
        title="Academy"
        tagline="Aprender y ganar confianza"
        description="El espacio principal de Koterie para consolidar bases, practicar con acompañamiento y participar de la comunidad mientras tu inglés crece."
        levels="A1 - B1"
        features={[
          { icon: BookOpenCheck, label: "Bases" },
          { icon: Languages, label: "Vocabulary" },
          { icon: MessageCircle, label: "Conversation" },
          { icon: Sparkles, label: "Practice" },
        ]}
        imageSrc="/images/academy-social.jpg"
        icon={GraduationCap}
        variant="academy"
        isHovered={hoveredCard === "academy"}
        onHover={() => setHoveredCard("academy")}
        onLeave={() => setHoveredCard(null)}
        onClick={() => router.push('/academy-forum')}
      />
      <HeroCard
        title="Studio"
        tagline="Fluidez y conversación avanzada"
        description="Un espacio en inglés para quienes ya pueden desenvolverse con soltura y quieren debatir, producir, compartir ideas y ayudar también a quienes están creciendo en Academy."
        levels="B2 - C2"
        features={[
          { icon: Mic, label: "Fluency" },
          { icon: Users, label: "Debate" },
          { icon: Rocket, label: "Real-world English" },
          { icon: MessageCircle, label: "Community" },
        ]}
        imageSrc="/images/studio-social.jpg"
        icon={Rocket}
        variant="studio"
        isHovered={hoveredCard === "studio"}
        onHover={() => setHoveredCard("studio")}
        onLeave={() => setHoveredCard(null)}
        onClick={() => router.push('/studio-forum')}
      />
    </div>
  )
}
