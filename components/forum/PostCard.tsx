"use client"

import { Heart, Share, Bookmark, Clock, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostCardProps {
  title: string
  author: string
  role: string
  category: string
  content: string
  replies: number
  views: number
  lastActivity: string
  pinned?: boolean
  tags?: string[]
  likes?: number
  categoryColor: string
  mediaUrl?: string
  timestamp?: string
}

export function PostCard({
  title,
  author,
  role,
  category,
  content,
  replies,
  views,
  lastActivity,
  pinned,
  tags,
  likes,
  categoryColor,
  mediaUrl,
  timestamp
}: PostCardProps) {
  return (
    <div className="rounded-3xl glass border border-border/50 p-6 transition-all duration-300 hover:shadow-[0_8px_30px_oklch(0_0_0/0.08)] hover:border-[oklch(0.72_0.19_220/0.3)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {pinned && (
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                <MessageSquare className="size-3" />
                Fijado
              </div>
            )}
            <div className={cn(
              "rounded-full border px-2 py-1 text-xs font-medium",
              categoryColor
            )}>
              {category}
            </div>
          </div>
          
          <h3 className="font-serif text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {content}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tags?.map((tag, index) => (
              <span key={index} className="rounded-full bg-secondary/20 px-2 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="size-6 rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] text-[10px] font-bold text-[oklch(0.99_0_0)] flex items-center justify-center">
                {author.charAt(0)}
              </div>
              <div>
                <span className="font-medium text-foreground">{author}</span>
                <span className="text-muted-foreground"> • {role}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span>{replies} respuestas</span>
              <span>{views} vistas</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {lastActivity}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Bookmark className="size-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Share className="size-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
            <Heart className="size-4" />
          </button>
        </div>
      </div>

      {mediaUrl && (
        <div className="mt-4 rounded-2xl overflow-hidden">
          {mediaUrl.includes('youtube.com') ? (
            <iframe
              src={mediaUrl}
              className="w-full h-64 rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={mediaUrl}
              alt={title}
              className="w-full h-64 object-cover rounded-2xl"
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
        <span>{timestamp}</span>
        <span>•</span>
        <span>{replies} respuestas</span>
        <span>•</span>
        <span>{views} vistas</span>
      </div>
    </div>
  )
}
