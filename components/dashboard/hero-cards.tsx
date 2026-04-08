"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from 'next-auth/react'
import Image from "next/image"
import {
  GraduationCap,
  Rocket,
  BookOpenCheck,
  Languages,
  Mic,
  Briefcase,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const onlineAvatars = [
  { initials: "MR", bg: "bg-[oklch(0.72_0.22_350)]" },
  { initials: "KL", bg: "bg-[oklch(0.75_0.18_55)]" },
  { initials: "JW", bg: "bg-[oklch(0.72_0.19_220)]" },
  { initials: "TS", bg: "bg-[oklch(0.7_0.2_170)]" },
]

interface HeroCardProps {
  title: string
  tagline: string
  description: string
  levels: string
  features: { icon: React.ElementType; label: string }[]
  memberCount: string
  activeNow: number
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
  memberCount,
  activeNow,
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
        "group relative flex flex-col overflow-hidden rounded-3xl text-left transition-all duration-500 ease-out",
        "glass",
        isHovered
          ? isAcademy
            ? "shadow-[0_8px_60px_oklch(0.72_0.19_220/0.3)] scale-[1.01]"
            : "shadow-[0_8px_60px_oklch(0.72_0.22_350/0.3)] scale-[1.01]"
          : "shadow-[0_4px_30px_oklch(0_0_0/0.06)]"
      )}
      style={{
        borderColor: isHovered
          ? isAcademy
            ? "oklch(0.72 0.19 220 / 0.4)"
            : "oklch(0.72 0.22 350 / 0.4)"
          : undefined,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Iridescent background shimmer */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-700",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 animate-shimmer",
            isAcademy
              ? "bg-gradient-to-r from-transparent via-[oklch(0.72_0.19_220/0.08)] to-transparent"
              : "bg-gradient-to-r from-transparent via-[oklch(0.72_0.22_350/0.08)] to-transparent"
          )}
        />
      </div>

      {/* Image section */}
      <div className="relative h-44 overflow-hidden sm:h-52">
        <Image
          src={imageSrc}
          alt={`${title} - social learning`}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isHovered ? "scale-110 brightness-105" : "scale-100"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {/* Gradient fade to glass */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(1_0_0/0.9)] via-[oklch(1_0_0/0.3)] to-transparent" />

        {/* Holographic accent strip */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-1 transition-all duration-500",
            isAcademy
              ? "bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.75_0.18_190)] to-[oklch(0.72_0.19_220)]"
              : "bg-gradient-to-r from-[oklch(0.72_0.22_350)] via-[oklch(0.75_0.18_55)] to-[oklch(0.72_0.22_350)]",
            isHovered ? "h-1.5 opacity-100" : "opacity-60"
          )}
        />

        {/* Floating level badge */}
        <div className="absolute left-4 top-4">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest glass-strong",
              isHovered
                ? isAcademy
                  ? "bg-[oklch(0.72_0.19_220)] text-[oklch(0.99_0_0)] border-[oklch(0.72_0.19_220)]"
                  : "bg-[oklch(0.72_0.22_350)] text-[oklch(0.99_0_0)] border-[oklch(0.72_0.22_350)]"
                : "text-foreground"
            )}
          >
            <Icon className="size-3" />
            {levels}
          </span>
        </div>

        {/* Online indicator */}
        <div className="absolute right-4 top-4">
          <span className="flex items-center gap-1.5 rounded-2xl glass-strong px-2.5 py-1.5 text-[11px] font-semibold text-foreground">
            <span className="size-2 rounded-full bg-[oklch(0.75_0.18_160)] shadow-[0_0_8px_oklch(0.75_0.18_160)]" />
            {activeNow} live
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col gap-3.5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl transition-all duration-500",
                  isAcademy
                    ? "bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)]"
                    : "bg-gradient-to-br from-[oklch(0.72_0.22_350)] to-[oklch(0.65_0.22_20)]"
                )}
              >
                <Icon className="size-5 text-[oklch(0.99_0_0)]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
                  {title}
                </h3>
                <p
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.2em]",
                    isAcademy ? "text-primary" : "text-accent"
                  )}
                >
                  {tagline}
                </p>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-500",
              isHovered
                ? isAcademy
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.19_220/0.4)]"
                  : "bg-accent text-accent-foreground shadow-[0_0_20px_oklch(0.72_0.22_350/0.4)]"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <ArrowRight
              className={cn(
                "size-4 transition-transform duration-300",
                isHovered && "translate-x-0.5"
              )}
            />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5">
          {features.map((feature) => (
            <span
              key={feature.label}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium glass",
                "text-secondary-foreground"
              )}
            >
              <feature.icon
                className={cn(
                  "size-3 shrink-0",
                  isAcademy ? "text-primary" : "text-accent"
                )}
              />
              {feature.label}
            </span>
          ))}
        </div>

        {/* Social footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {onlineAvatars.map((a) => (
                <div
                  key={a.initials}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border-2 border-[oklch(1_0_0/0.8)] text-[9px] font-bold text-[oklch(0.99_0_0)]",
                    a.bg
                  )}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{memberCount}</span>{" "}
              members
            </span>
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all duration-500",
              isHovered
                ? isAcademy
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.19_220/0.3)]"
                  : "bg-accent text-accent-foreground shadow-[0_0_20px_oklch(0.72_0.22_350/0.3)]"
                : isAcademy
                  ? "bg-[oklch(0.72_0.19_220/0.1)] text-primary"
                  : "bg-[oklch(0.72_0.22_350/0.1)] text-accent"
            )}
          >
            <Zap className="size-3" />
            Enter
          </span>
        </div>
      </div>
    </button>
  )
}

export function HeroCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()

  const handleCardClick = async (destination: string) => {
    try {
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      
      if (!session || !session.user) {
        await signIn('google')
      } else {
        router.push(destination)
      }
    } catch (error) {
      await signIn('google')
    }
  }

  return (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
      <HeroCard
        title="Academy"
        tagline="Your Growth Hub"
        description="Join a vibrant community building their English foundation. Interactive lessons, live rooms, and guided challenges."
        levels="A1 - A2"
        features={[
          { icon: BookOpenCheck, label: "Grammar" },
          { icon: Languages, label: "Vocab" },
          { icon: GraduationCap, label: "Guided" },
          { icon: Sparkles, label: "Daily" },
        ]}
        memberCount="2.4k"
        activeNow={142}
        imageSrc="/images/academy-social.jpg"
        icon={GraduationCap}
        variant="academy"
        isHovered={hoveredCard === "academy"}
        onHover={() => setHoveredCard("academy")}
        onLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick('/academy-forum')}
      />
      <HeroCard
        title="Studio"
        tagline="The Pro Lounge"
        description="Where advanced speakers refine fluency. Business English, presentations, and real-world challenges."
        levels="B1+"
        features={[
          { icon: Mic, label: "Fluency" },
          { icon: Briefcase, label: "Business" },
          { icon: Rocket, label: "Produce" },
          { icon: Users, label: "Reviews" },
        ]}
        memberCount="1.8k"
        activeNow={89}
        imageSrc="/images/studio-social.jpg"
        icon={Rocket}
        variant="studio"
        isHovered={hoveredCard === "studio"}
        onHover={() => setHoveredCard("studio")}
        onLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick('/studio-forum')}
      />
    </div>
  )
}
