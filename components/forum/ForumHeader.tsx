"use client"

import { GraduationCap, Rocket } from "lucide-react"

interface ForumHeaderProps {
  forumType: 'academy' | 'studio'
  title: string
  description: string
}

export function ForumHeader({ forumType, title, description }: ForumHeaderProps) {
  const getForumIcon = () => {
    return forumType === 'academy' ? (
      <GraduationCap className="size-6 text-[oklch(0.99_0_0)]" />
    ) : (
      <Rocket className="size-6 text-[oklch(0.99_0_0)]" />
    )
  }

  const getForumColors = () => {
    return forumType === 'academy' 
      ? 'from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)]'
      : 'from-[oklch(0.72_0.22_350)] via-[oklch(0.75_0.18_55)] to-[oklch(0.72_0.19_220)]'
  }

  const colors = getForumColors()

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
        {getForumIcon()}
      </div>
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
