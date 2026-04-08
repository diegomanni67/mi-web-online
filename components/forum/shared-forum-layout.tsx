"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { Home } from "lucide-react"
import { useSession } from "next-auth/react"
import { ForumHeader } from "./ForumHeader"
import { ForumSidebar } from "./ForumSidebar"
import { PostCard } from "./PostCard"
import { AIChatSidebar } from "./AIChatSidebar"

interface SharedForumLayoutProps {
  children?: ReactNode
  forumType: 'academy' | 'studio'
  title: string
  description: string
  categories: Array<{ id: string; name: string; color: string }>
  memberCount: string
  activeNow: number
  posts: Array<{
    id: number
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
    mediaUrl?: string
    timestamp?: string
  }>
}

export function SharedForumLayout({ 
  children, 
  forumType,
  title,
  description,
  categories,
  memberCount,
  activeNow,
  posts
}: SharedForumLayoutProps) {
  const { data: session } = useSession()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Check if user has access to Studio level chat
  const canAccessStudioChat = forumType === 'studio' && 
    (session?.user?.subscriptionLevel === 'studio' || session?.user?.email === 'diegomanni67@gmail.com')

  // For Academy, everyone has access
  const canAccessChat = forumType === 'academy' || canAccessStudioChat
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
        <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <ForumHeader 
                forumType={forumType}
                title={title}
                description={description}
              />
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                title="Volver al Inicio"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Volver al Inicio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-b border-border/50 bg-secondary/20">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100">
                  <div className="size-5 text-blue-600">👥</div>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{memberCount}</p>
                  <p className="text-xs text-muted-foreground">Miembros</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
                  <div className="size-5 text-green-600">💬</div>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{posts.length}</p>
                  <p className="text-xs text-muted-foreground">Discusiones</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100">
                  <div className="size-5 text-purple-600">🔥</div>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{activeNow}</p>
                  <p className="text-xs text-muted-foreground">Activos hoy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100">
                  <div className="size-5 text-orange-600">📅</div>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Próximo evento</p>
                  <p className="text-xs text-muted-foreground">En 2 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ForumSidebar 
                categories={categories}
                memberCount={memberCount}
                activeNow={activeNow}
                forumType={forumType}
              />
            </div>

            {/* Posts */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    author={post.author}
                    role={post.role}
                    category={post.category}
                    content={post.content}
                    replies={post.replies}
                    views={post.views}
                    lastActivity={post.lastActivity}
                    pinned={post.pinned}
                    tags={post.tags}
                    likes={post.likes}
                    categoryColor={
                      categories.find(c => c.id === post.category)?.color || 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                    mediaUrl={post.mediaUrl}
                    timestamp={post.timestamp}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar - Only show if user has access */}
      {canAccessChat && (
        <AIChatSidebar
          forumType={forumType}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      )}
    </div>
  )
}
