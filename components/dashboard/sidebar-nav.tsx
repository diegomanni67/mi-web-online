"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  TrendingUp,
  MessageCircle,
  User,
  Sparkles,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#", active: true },
  { icon: TrendingUp, label: "My Progress", href: "#progress" },
  {
    icon: MessageCircle,
    label: "Community",
    href: "/community",
  },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "#settings" },
]

export function SidebarNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 px-4 glass-strong lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex size-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-sm font-bold tracking-tight text-foreground">
            Koterie
          </span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[oklch(0.25_0.03_270/0.3)] backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop icon rail */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[72px] flex-col items-center py-5 glass-strong lg:flex">
        {/* Logo */}
        <div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "relative flex size-10 items-center justify-center rounded-xl transition-all duration-300",
                      item.active
                        ? "bg-primary/10 text-primary shadow-[0_0_12px_oklch(0.72_0.19_220/0.15)]"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-[18px]" />
                    {item.active && (
                      <span className="absolute -left-[2px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    {item.badge && (
                      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[oklch(0.75_0.18_160)] shadow-[0_0_6px_oklch(0.75_0.18_160)]" />
                    )}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex size-10 items-center justify-center rounded-xl transition-all duration-300",
                      item.active
                        ? "bg-primary/10 text-primary shadow-[0_0_12px_oklch(0.72_0.19_220/0.15)]"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-[18px]" />
                    {item.active && (
                      <span className="absolute -left-[2px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    {item.badge && (
                      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[oklch(0.75_0.18_160)] shadow-[0_0_6px_oklch(0.75_0.18_160)]" />
                    )}
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={12}
                className="glass-strong rounded-xl border-border text-foreground"
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 text-[oklch(0.75_0.18_160)]">
                    ({item.badge})
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-xl transition-all hover:ring-2 hover:ring-primary/30"
              aria-label="User profile"
            >
              <Avatar className="size-9">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-bold text-foreground rounded-xl">
                  AL
                </AvatarFallback>
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="glass-strong rounded-xl border-border text-foreground"
          >
            Alex Learner - A2
          </TooltipContent>
        </Tooltip>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[300px] flex-col glass-strong shadow-[8px_0_40px_oklch(0_0_0/0.1)] transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-bold tracking-tight text-foreground">
                Koterie
              </span>
              <span className="text-[10px] text-muted-foreground">
                Language Studio
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1" role="list">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-[18px] shrink-0",
                        item.active
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-[oklch(0.75_0.18_160/0.12)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.55_0.18_160)]">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-[18px] shrink-0",
                        item.active
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-[oklch(0.75_0.18_160/0.12)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.55_0.18_160)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar className="size-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-bold text-foreground">
                AL
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-foreground">
                Alex Learner
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                Level A2
              </span>
            </div>
            <button
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
