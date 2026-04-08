"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Target, Clock, Trophy, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    icon: Flame,
    label: "Streak",
    value: "7d",
    color: "text-[oklch(0.75_0.18_55)]",
    glow: "shadow-[0_0_12px_oklch(0.75_0.18_55/0.3)]",
    bgColor: "bg-[oklch(0.75_0.18_55/0.1)]",
  },
  {
    icon: Target,
    label: "Accuracy",
    value: "87%",
    color: "text-primary",
    glow: "shadow-[0_0_12px_oklch(0.72_0.19_220/0.3)]",
    bgColor: "bg-primary/10",
  },
  {
    icon: Clock,
    label: "Weekly",
    value: "4.5h",
    color: "text-accent",
    glow: "shadow-[0_0_12px_oklch(0.72_0.22_350/0.3)]",
    bgColor: "bg-accent/10",
  },
  {
    icon: Trophy,
    label: "XP",
    value: "1,240",
    color: "text-[oklch(0.75_0.18_55)]",
    glow: "shadow-[0_0_12px_oklch(0.75_0.18_55/0.3)]",
    bgColor: "bg-[oklch(0.75_0.18_55/0.1)]",
  },
]

export function LevelStatus() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl glass p-5 shadow-[0_4px_30px_oklch(0_0_0/0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp className="size-4 text-primary" />
          </div>
          <h2 className="font-serif text-base font-bold tracking-tight text-foreground">
            Progress
          </h2>
        </div>
        <Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 text-[10px] font-bold shadow-[0_0_10px_oklch(0.72_0.19_220/0.2)]">
          Level A2
        </Badge>
      </div>

      {/* Big streak display */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.18_55/0.1)] to-transparent p-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[oklch(0.75_0.18_55/0.15)] shadow-[0_0_20px_oklch(0.75_0.18_55/0.2)]">
          <Flame className="size-6 text-[oklch(0.75_0.18_55)]" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground">7 days</span>
          <span className="text-[11px] text-muted-foreground">
            3 more to unlock a new badge
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2 rounded-2xl glass p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Progress to B1</span>
          <span className="font-bold text-primary">72%</span>
        </div>
        <Progress value={72} className="h-2.5 bg-secondary" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl glass p-3 transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0_0_0/0.06)]"
            )}
          >
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-xl",
                stat.bgColor,
                stat.glow
              )}
            >
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
            <span className="text-sm font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
