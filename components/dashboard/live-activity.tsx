"use client"

import {
  Headphones,
  MessageSquare,
  Mic2,
  Radio,
  Users,
  Volume2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const voiceRooms = [
  {
    name: "Pronunciation Lab",
    participants: 8,
    level: "A2",
    variant: "academy" as const,
    avatars: [
      { initials: "SM", bg: "bg-[oklch(0.72_0.22_350)]" },
      { initials: "KT", bg: "bg-[oklch(0.72_0.19_220)]" },
      { initials: "AK", bg: "bg-[oklch(0.75_0.18_55)]" },
    ],
  },
  {
    name: "Business Pitch Practice",
    participants: 5,
    level: "B2",
    variant: "studio" as const,
    avatars: [
      { initials: "LF", bg: "bg-[oklch(0.72_0.19_220)]" },
      { initials: "YP", bg: "bg-[oklch(0.72_0.22_350)]" },
    ],
  },
  {
    name: "Debate Club",
    participants: 12,
    level: "B1+",
    variant: "studio" as const,
    avatars: [
      { initials: "JW", bg: "bg-[oklch(0.75_0.18_55)]" },
      { initials: "TS", bg: "bg-[oklch(0.7_0.2_170)]" },
      { initials: "MR", bg: "bg-[oklch(0.72_0.22_350)]" },
    ],
  },
]

const recentActivity = [
  {
    user: "Sofia M.",
    initials: "SM",
    bg: "bg-[oklch(0.72_0.22_350)]",
    action: "completed Grammar Foundations",
    time: "2m ago",
  },
  {
    user: "Kenji T.",
    initials: "KT",
    bg: "bg-[oklch(0.72_0.19_220)]",
    action: "joined Pronunciation Lab",
    time: "5m ago",
  },
  {
    user: "Anna K.",
    initials: "AK",
    bg: "bg-[oklch(0.75_0.18_55)]",
    action: "earned 50 XP streak bonus",
    time: "12m ago",
  },
  {
    user: "Lucas F.",
    initials: "LF",
    bg: "bg-[oklch(0.7_0.2_170)]",
    action: "started Business Email Writing",
    time: "18m ago",
  },
]

export function LiveActivity() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl glass p-5 shadow-[0_4px_30px_oklch(0_0_0/0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex size-8 items-center justify-center rounded-xl bg-[oklch(0.65_0.25_25/0.1)]">
            <Radio className="size-4 text-[oklch(0.65_0.25_25)]" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[oklch(0.65_0.25_25)] shadow-[0_0_8px_oklch(0.65_0.25_25)] animate-pulse" />
          </div>
          <h2 className="font-serif text-base font-bold tracking-tight text-foreground">
            Live Now
          </h2>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {voiceRooms.reduce((sum, r) => sum + r.participants, 0)} in rooms
        </span>
      </div>

      {/* Voice Rooms */}
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <Headphones className="size-3" />
          Voice Rooms
        </span>
        {voiceRooms.map((room) => {
          const isAcademy = room.variant === "academy"
          return (
            <button
              key={room.name}
              className="group flex items-center gap-3 rounded-2xl glass p-3 text-left transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0_0_0/0.06)]"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  isAcademy
                    ? "bg-primary/10 group-hover:shadow-[0_0_15px_oklch(0.72_0.19_220/0.25)]"
                    : "bg-accent/10 group-hover:shadow-[0_0_15px_oklch(0.72_0.22_350/0.25)]"
                )}
              >
                <Volume2
                  className={cn(
                    "size-4",
                    isAcademy ? "text-primary" : "text-accent"
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-medium text-foreground">
                  {room.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      isAcademy ? "text-primary" : "text-accent"
                    )}
                  >
                    {room.level}
                  </span>
                  <div className="flex -space-x-1.5">
                    {room.avatars.map((a) => (
                      <div
                        key={a.initials}
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border-[1.5px] border-[oklch(1_0_0/0.8)] text-[7px] font-bold text-[oklch(0.99_0_0)]",
                          a.bg
                        )}
                      >
                        {a.initials}
                      </div>
                    ))}
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    +{room.participants - room.avatars.length}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[oklch(0.65_0.25_25/0.08)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.65_0.25_25)]">
                <span className="size-1.5 rounded-full bg-[oklch(0.65_0.25_25)] shadow-[0_0_6px_oklch(0.65_0.25_25)] animate-pulse" />
                Live
              </span>
            </button>
          )
        })}
      </div>

      {/* Community Activity Feed */}
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <MessageSquare className="size-3" />
          Activity Feed
        </span>
        {recentActivity.map((activity, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl p-2.5 transition-all duration-300 hover:bg-secondary/40"
          >
            {/* Glowing avatar */}
            <div className="relative">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-[oklch(0.99_0_0)]",
                  activity.bg
                )}
              >
                {activity.initials}
              </div>
              <div
                className={cn(
                  "absolute inset-0 rounded-full blur-md opacity-40",
                  activity.bg
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
              <span className="truncate text-xs">
                <span className="font-semibold text-foreground">
                  {activity.user}
                </span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </span>
              <span className="text-[10px] text-muted-foreground">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
