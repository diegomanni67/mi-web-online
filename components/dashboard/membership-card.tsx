"use client"

import {
  Users,
  BookOpen,
  Bot,
  MessageSquare,
  Headphones,
  Film,
  Tag,
  Library,
  Sparkles,
  Crown,
  ArrowRight,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: BookOpen,
    text: "Clase grupal semanal (2 horas) con profesores profesionales.",
    color: "text-primary",
    glow: "shadow-[0_0_10px_oklch(0.72_0.19_220/0.3)]",
    bg: "bg-primary/10",
  },
  {
    icon: Bot,
    text: "Practica 24/7 con ejercicios y correccion inmediata por IA.",
    color: "text-accent",
    glow: "shadow-[0_0_10px_oklch(0.72_0.22_350/0.3)]",
    bg: "bg-accent/10",
  },
  {
    icon: MessageSquare,
    text: "Foros exclusivos para conversar sobre tus intereses.",
    color: "text-[oklch(0.75_0.18_55)]",
    glow: "shadow-[0_0_10px_oklch(0.75_0.18_55/0.3)]",
    bg: "bg-[oklch(0.75_0.18_55/0.1)]",
  },
  {
    icon: Headphones,
    text: "Comunidad en Discord activa las 24 horas.",
    color: "text-[oklch(0.6_0.2_280)]",
    glow: "shadow-[0_0_10px_oklch(0.6_0.2_280/0.3)]",
    bg: "bg-[oklch(0.6_0.2_280/0.1)]",
  },
  {
    icon: Film,
    text: "Watch Parties con resenas interactivas y ejercicios.",
    color: "text-primary",
    glow: "shadow-[0_0_10px_oklch(0.72_0.19_220/0.3)]",
    bg: "bg-primary/10",
  },
  {
    icon: Tag,
    text: "Descuentos en seminarios y eventos especiales.",
    color: "text-accent",
    glow: "shadow-[0_0_10px_oklch(0.72_0.22_350/0.3)]",
    bg: "bg-accent/10",
  },
  {
    icon: Library,
    text: "Acceso ilimitado a todo el material de estudio.",
    color: "text-[oklch(0.75_0.18_55)]",
    glow: "shadow-[0_0_10px_oklch(0.75_0.18_55/0.3)]",
    bg: "bg-[oklch(0.75_0.18_55/0.1)]",
  },
]

export function MembershipCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-[0_8px_60px_oklch(0_0_0/0.08)]">
      {/* Animated gradient header band */}
      <div className="relative overflow-hidden px-6 pb-8 pt-6 sm:px-8 sm:pt-8">
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]" />
        <div className="absolute inset-0 bg-[oklch(1_0_0/0.1)] backdrop-blur-sm" />
        {/* Glow orbs */}
        <div className="absolute -left-16 -top-16 size-48 rounded-full bg-[oklch(1_0_0/0.2)] blur-3xl animate-glow" />
        <div className="absolute -bottom-20 -right-10 size-52 rounded-full bg-[oklch(1_0_0/0.15)] blur-3xl animate-glow" />
        <div className="absolute left-1/2 top-0 size-32 -translate-x-1/2 rounded-full bg-[oklch(1_0_0/0.12)] blur-2xl" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          {/* VIP badge */}
          <div className="flex items-center gap-2 rounded-full bg-[oklch(1_0_0/0.2)] px-4 py-1.5 backdrop-blur-xl">
            <Crown className="size-4 text-[oklch(1_0_0/0.95)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[oklch(1_0_0/0.9)]">
              VIP Membership
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[oklch(0.99_0_0)] sm:text-4xl text-balance drop-shadow-[0_2px_10px_oklch(0_0_0/0.15)]">
            {"Membres\u00EDa Koterie"}
          </h2>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-medium text-[oklch(1_0_0/0.7)]">
              U$S
            </span>
            <span className="font-serif text-6xl font-bold text-[oklch(0.99_0_0)] drop-shadow-[0_2px_20px_oklch(0_0_0/0.2)] sm:text-7xl">
              80
            </span>
            <span className="text-lg font-medium text-[oklch(1_0_0/0.7)]">
              / mes
            </span>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-[oklch(1_0_0/0.75)]">
            Todo lo que necesitas para dominar el ingles, en una sola
            experiencia premium.
          </p>
        </div>
      </div>

      {/* Features list on glass background */}
      <div className="glass-strong rounded-t-3xl -mt-4 relative z-10 px-5 pb-6 pt-7 sm:px-7">
        <div className="flex flex-col gap-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group flex items-start gap-3.5 rounded-2xl glass p-3.5 transition-all duration-300 hover:shadow-[0_4px_25px_oklch(0_0_0/0.06)]"
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  feature.bg,
                  "group-hover:" + feature.glow.replace("shadow-", "shadow-")
                )}
                style={{
                  boxShadow: undefined,
                }}
              >
                <feature.icon className={cn("size-[18px]", feature.color)} />
              </div>
              <div className="flex flex-1 items-center gap-2 pt-1.5">
                <p className="text-sm leading-relaxed text-foreground">
                  {feature.text}
                </p>
              </div>
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.75_0.18_160/0.12)] mt-1.5">
                <Check className="size-3 text-[oklch(0.55_0.18_160)]" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            className={cn(
              "group relative w-full overflow-hidden rounded-2xl px-8 py-4 text-center font-serif text-lg font-bold tracking-tight transition-all duration-500",
              "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]",
              "text-[oklch(0.99_0_0)]",
              "shadow-[0_8px_40px_oklch(0.72_0.19_220/0.3)]",
              "hover:shadow-[0_12px_50px_oklch(0.72_0.22_350/0.4)]",
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-[oklch(1_0_0/0.2)] to-transparent" />
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              <Sparkles className="size-5" />
              {"Sumate a la Koterie"}
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              +2,400 miembros activos
            </span>
            <span className="size-1 rounded-full bg-border" />
            <span>Cancela cuando quieras</span>
          </div>
        </div>
      </div>
    </div>
  )
}
