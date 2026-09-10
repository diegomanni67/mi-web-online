"use client"

import { useEffect, useMemo, useState } from "react"
import { forumStorage, ForumThread } from "@/lib/forum-storage"
import { Eye, MessageCircle, Pin, Plus, Search } from "lucide-react"

interface ForumThreadViewProps {
  categoryId: string
  categoryName: string
  onBack: () => void
  onThreadClick: (threadId: string) => void
  onCreateThread: () => void
}

export function ForumThreadView({ categoryId, categoryName, onBack, onThreadClick, onCreateThread }: ForumThreadViewProps) {
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    forumStorage.getThreads(categoryId)
      .then((result) => active && setThreads(result))
      .catch(() => active && setError('No pudimos cargar las conversaciones.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [categoryId])

  const visibleThreads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const result = term
      ? threads.filter((thread) => `${thread.title} ${thread.content} ${thread.author}`.toLowerCase().includes(term))
      : [...threads]

    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (sortBy === 'popular') return b.replies - a.replies
      if (sortBy === 'views') return b.views - a.views
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
    return result
  }, [threads, searchTerm, sortBy])

  function timeAgo(date: Date) {
    const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000))
    if (minutes < 60) return minutes < 2 ? 'just now' : `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  async function openThread(id: string) {
    onThreadClick(id)
    void forumStorage.updateThreadViews(id)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button onClick={onBack} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">← Back to community</button>

        <div className="mt-7 flex flex-col gap-5 border-b border-white/[0.07] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">Koterie forum</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{categoryName}</h1>
            <p className="mt-2 text-sm text-white/40">One shared conversation space for the whole community.</p>
          </div>
          <button onClick={onCreateThread} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 font-bold text-white transition hover:brightness-110">
            <Plus className="h-4 w-4" /> Start a conversation
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search conversations..." className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-purple-400/35" />
          </div>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm text-white/70 outline-none">
            <option value="latest">Latest</option>
            <option value="popular">Most replies</option>
            <option value="views">Most viewed</option>
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {loading && <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center text-sm text-white/40">Loading conversations…</div>}
          {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">{error}</div>}
          {!loading && !error && visibleThreads.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-white/20" />
              <h2 className="mt-4 text-xl font-bold">No conversations yet.</h2>
              <p className="mt-2 text-sm text-white/40">Start the first conversation in this topic and give everyone something to respond to.</p>
              <button onClick={onCreateThread} className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold transition hover:bg-purple-500">Start the first one</button>
            </div>
          )}

          {!loading && !error && visibleThreads.map((thread) => (
            <button key={thread.id} onClick={() => openThread(thread.id)} className="group w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition hover:border-purple-400/25 hover:bg-white/[0.05] sm:p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {thread.pinned && <Pin className="h-4 w-4 text-amber-300" />}
                    <h2 className="text-lg font-bold text-white transition group-hover:text-purple-300">{thread.title}</h2>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">{thread.content}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/30">
                    <span className="font-semibold text-purple-300/80">{thread.author}</span>
                    <span>{timeAgo(thread.updatedAt)}</span>
                    {thread.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2 py-1">#{tag}</span>)}
                  </div>
                </div>
                <div className="hidden shrink-0 items-start gap-3 text-xs text-white/30 sm:flex">
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {thread.replies}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {thread.views}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
