"use client"

import { Crown, Flame, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const topMembers = [
  {
    rank: 1,
    name: "Sofia M.",
    initials: "SM",
    xp: 4820,
    streak: 45,
    bg: "bg-[oklch(0.72_0.22_350)]",
  },
  {
    rank: 2,
    name: "Kenji T.",
    initials: "KT",
    xp: 4210,
    streak: 38,
    bg: "bg-[oklch(0.72_0.19_220)]",
  },
  {
    rank: 3,
    name: "Anna K.",
    initials: "AK",
    xp: 3890,
    streak: 31,
    bg: "bg-[oklch(0.75_0.18_55)]",
  },
  {
    rank: 4,
    name: "Lucas F.",
    initials: "LF",
    xp: 3540,
    streak: 27,
    bg: "bg-[oklch(0.7_0.2_170)]",
  },
  {
    rank: 5,
    name: "Yuna P.",
    initials: "YP",
    xp: 3280,
    streak: 22,
    bg: "bg-[oklch(0.65_0.2_300)]",
  },
]

const spotlightMember = topMembers[0]

export function Leaderboard() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl glass p-5 shadow-[0_4px_30px_oklch(0_0_0/0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[oklch(0.75_0.18_55/0.12)] shadow-[0_0_10px_oklch(0.75_0.18_55/0.2)]">
            <Trophy className="size-4 text-[oklch(0.75_0.18_55)]" />
          </div>
          <h2 className="font-serif text-base font-bold tracking-tight text-foreground">
            Top 5
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-primary">
          This Week
        </span>
      </div>

      {/* Member of the month spotlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.18_55/0.1)] via-transparent to-[oklch(0.72_0.22_350/0.05)] p-3.5 glass">
        <div className="absolute -right-4 -top-4 size-16 rounded-full bg-[oklch(0.75_0.18_55/0.1)] blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl text-xs font-bold text-[oklch(0.99_0_0)]",
                spotlightMember.bg
              )}
            >
              {spotlightMember.initials}
            </div>
            {/* Glow */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl blur-lg opacity-40",
                spotlightMember.bg
              )}
            />
            <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full glass-strong">
              <Crown className="size-3 text-[oklch(0.75_0.18_55)]" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[oklch(0.75_0.18_55)]">
              Member of the Month
            </span>
            <span className="text-sm font-bold text-foreground">
              {spotlightMember.name}
            </span>
            <span className="text-[10px] font-semibold text-[oklch(0.75_0.18_55)]">
              {spotlightMember.xp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="flex flex-col gap-1">
        {topMembers.map((member) => (
          <div
            key={member.name}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-300",
              member.rank === 1
                ? "bg-[oklch(0.75_0.18_55/0.06)]"
                : "hover:bg-secondary/30"
            )}
          >
            <span className="w-5 text-center text-[11px] font-bold text-muted-foreground">
              {member.rank}
            </span>
            <div className="relative">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-[oklch(0.99_0_0)]",
                  member.bg
                )}
              >
                {member.initials}
              </div>
              <div
                className={cn(
                  "absolute inset-0 rounded-lg blur-md opacity-30",
                  member.bg
                )}
              />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-xs font-medium text-foreground">
                {member.name}
              </span>
              <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                <Flame className="size-2.5 text-[oklch(0.75_0.18_55)]" />
                {member.streak}d
              </span>
            </div>
            <span className="text-xs font-bold text-foreground">
              {member.xp.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
