"use client"

import { Bell, Search, Flame, Sparkles } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-5">
      {/* Top row: search & actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="flex size-10 items-center justify-center rounded-2xl glass text-muted-foreground transition-all duration-300 hover:text-foreground hover:shadow-[0_4px_20px_oklch(0_0_0/0.06)]"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Daily streak */}
          <div className="flex items-center gap-1.5 rounded-2xl glass px-3 py-2">
            <Flame className="size-4 text-[oklch(0.75_0.18_55)]" />
            <span className="text-sm font-bold text-foreground">7</span>
            <span className="hidden text-[11px] text-muted-foreground sm:inline">
              day streak
            </span>
          </div>
          <button
            className="relative flex size-10 items-center justify-center rounded-2xl glass text-muted-foreground transition-all duration-300 hover:text-foreground hover:shadow-[0_4px_20px_oklch(0_0_0/0.06)]"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground shadow-[0_0_8px_oklch(0.72_0.22_350/0.4)]">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Massive glowing header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]" />
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-[oklch(1_0_0/0.15)] backdrop-blur-sm" />
        {/* Glow orbs */}
        <div className="absolute -left-10 -top-10 size-40 rounded-full bg-[oklch(1_0_0/0.2)] blur-3xl animate-glow" />
        <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-[oklch(1_0_0/0.15)] blur-3xl animate-glow" />

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[oklch(1_0_0/0.9)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[oklch(1_0_0/0.8)]">
              Welcome back, Alex
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[oklch(0.99_0_0)] sm:text-4xl lg:text-5xl text-balance drop-shadow-[0_2px_10px_oklch(0_0_0/0.2)]">
            Welcome to the Koterie
          </h1>
          <p className="max-w-md text-sm text-[oklch(1_0_0/0.8)] leading-relaxed">
            Tu lugar exclusivo para aprender inglés con una comunidad vibrante. 
            Únete a salas de voz, mantén tu racha y explora nuevas experiencias hoy mismo.
          </p>
        </div>
      </div>
    </header>
  )
}
