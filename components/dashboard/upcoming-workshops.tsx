"use client"

import { ArrowRight, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const workshops = [
  {
    title: "Everyday Conversations",
    host: "Ms. Sarah Collins",
    date: "Feb 22",
    time: "10:00 AM",
    attendees: 24,
    level: "A1-A2",
    variant: "academy" as const,
    live: true,
  },
  {
    title: "Business Email Writing",
    host: "Mr. James Reid",
    date: "Feb 24",
    time: "2:00 PM",
    attendees: 18,
    level: "B1+",
    variant: "studio" as const,
    live: false,
  },
  {
    title: "Pronunciation Masterclass",
    host: "Dr. Emily Torres",
    date: "Feb 26",
    time: "11:00 AM",
    attendees: 31,
    level: "All",
    variant: "academy" as const,
    live: false,
  },
]

export function UpcomingWorkshops() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl glass p-5 shadow-[0_4px_30px_oklch(0_0_0/0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 shadow-[0_0_10px_oklch(0.72_0.19_220/0.15)]">
            <Zap className="size-4 text-primary" />
          </div>
          <h2 className="font-serif text-base font-bold tracking-tight text-foreground">
            Events
          </h2>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary/80">
          View All
          <ArrowRight className="size-3" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {workshops.map((w) => {
          const isAcademy = w.variant === "academy"
          return (
            <div
              key={w.title}
              className="group flex items-center gap-3 rounded-2xl glass p-3 transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0_0_0/0.06)]"
            >
              {/* Date */}
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl glass-strong">
                <span className="text-[10px] uppercase text-muted-foreground">
                  {w.date.split(" ")[0]}
                </span>
                <span className="text-base font-bold text-foreground">
                  {w.date.split(" ")[1]}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {w.title}
                  </span>
                  {w.live && (
                    <span className="flex items-center gap-1 rounded-full bg-[oklch(0.65_0.25_25/0.08)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.65_0.25_25)]">
                      <span className="size-1.5 rounded-full bg-[oklch(0.65_0.25_25)] shadow-[0_0_6px_oklch(0.65_0.25_25)] animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{w.host}</span>
                  <span className="text-border">|</span>
                  <span>{w.time}</span>
                </div>
              </div>

              {/* Right */}
              <div className="hidden items-center gap-2 sm:flex">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isAcademy
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {w.level}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="size-3" />
                  {w.attendees}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
