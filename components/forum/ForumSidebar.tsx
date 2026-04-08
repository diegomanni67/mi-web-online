"use client"

import { useState } from "react"
import { Users, MessageSquare, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ForumSidebarProps {
  categories: Array<{ id: string; name: string; color: string }>
  memberCount: string
  activeNow: number
  forumType: 'academy' | 'studio'
}

export function ForumSidebar({ categories, memberCount, activeNow, forumType }: ForumSidebarProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  const getForumColors = () => {
    return forumType === 'academy' 
      ? {
          primary: 'from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]',
          accent: 'bg-blue-100 text-blue-800 border-blue-200'
        }
      : {
          primary: 'from-[oklch(0.72_0.22_350)] via-[oklch(0.75_0.18_55)] to-[oklch(0.72_0.19_220)]',
          accent: 'bg-purple-100 text-purple-800 border-purple-200'
        }
  }

  const colors = getForumColors()

  return (
    <div className="rounded-3xl glass border border-border/50 p-6 sticky top-6">
      <h3 className="font-semibold text-foreground mb-4">Categorías</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
              activeCategory === category.id ? colors.accent : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)]" />
              <span>{category.name}</span>
            </div>
            <span className="text-xs">0</span>
          </button>
        ))}
      </div>

      {/* User Info */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="text-center">
          <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] text-2xl font-bold text-[oklch(0.99_0_0)]">
            U
          </div>
          <h4 className="font-semibold text-foreground">Usuario Ejemplo</h4>
          <p className="text-sm text-muted-foreground">Estudiante {forumType === 'academy' ? 'A2' : 'B1'}</p>
          <div className={cn(
            "mt-2 rounded-full px-3 py-1 text-xs font-medium",
            colors.accent
          )}>
            {forumType === 'academy' ? 'Academy Member' : 'Studio Member'}
          </div>
        </div>
      </div>

      {/* Forum Stats */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <h3 className="font-semibold text-foreground mb-4">Estadísticas</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{memberCount}</p>
              <p className="text-xs text-muted-foreground">Miembros</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
              <MessageSquare className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Discusiones</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100">
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{activeNow}</p>
              <p className="text-xs text-muted-foreground">Activos hoy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100">
              <Calendar className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Próximo evento</p>
              <p className="text-xs text-muted-foreground">En 2 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
