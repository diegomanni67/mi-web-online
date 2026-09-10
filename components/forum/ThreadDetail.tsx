"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { forumStorage, ForumReply, ForumThread } from "@/lib/forum-storage"
import { useMember } from "@/components/member/useMember"
import { ArrowLeft, Clock, MessageCircle, Reply, Send } from "lucide-react"

interface ThreadDetailProps {
  threadId: string
  onBack: () => void
  categoryName?: string
}

export function ThreadDetail({ threadId, onBack, categoryName }: ThreadDetailProps) {
  const { member } = useMember()
  const [thread, setThread] = useState<ForumThread | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([forumStorage.getThread(threadId), forumStorage.getReplies(threadId)])
      .then(([loadedThread, loadedReplies]) => {
        if (!active) return
        setThread(loadedThread)
        setReplies(loadedReplies)
      })
      .catch(() => active && setError('No pudimos cargar esta conversación.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [threadId])

  const childrenByParent = useMemo(() => {
    const map = new Map<string, ForumReply[]>()
    replies.forEach((reply) => {
      if (!reply.parentId) return
      map.set(reply.parentId, [...(map.get(reply.parentId) || []), reply])
    })
    return map
  }, [replies])

  const topLevel = replies.filter((reply) => !reply.parentId)

  function timeAgo(date: Date) {
    const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000))
    if (minutes < 60) return minutes < 2 ? 'just now' : `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  async function submitReply(event: FormEvent) {
    event.preventDefault()
    const content = replyContent.trim()
    if (!content) return setError('Escribí una respuesta antes de publicar.')
    setSubmitting(true)
    setError('')
    try {
      const created = await forumStorage.saveReply({
        threadId,
        author: member?.name || '',
        authorEmail: member?.email || '',
        authorRole: member?.role === 'teacher' ? 'Teacher' : member?.role === 'admin' ? 'Admin' : 'Koterie member',
        content,
        parentId: replyingTo || undefined,
      })
      setReplies((current) => [...current, created])
      setReplyContent('')
      setReplyingTo(null)
      setThread((current) => current ? { ...current, replies: current.replies + 1, updatedAt: new Date() } : current)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos publicar tu respuesta.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <main className="min-h-screen bg-[#0a0f1e] p-10 text-center text-white/40">Loading conversation…</main>
  if (!thread) return <main className="min-h-screen bg-[#0a0f1e] p-10 text-center text-white"><p>{error || 'Conversation not found.'}</p><button onClick={onBack} className="mt-5 text-purple-300">Go back</button></main>

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> {categoryName || 'Back'}</button>

        <article className="mt-7 rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-purple-950/35 to-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/30"><span className="rounded-full bg-purple-500/15 px-3 py-1.5 font-bold uppercase tracking-[0.12em] text-purple-300">Koterie forum</span><span>{timeAgo(thread.createdAt)}</span><span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {thread.replies} replies</span></div>
          <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">{thread.title}</h1>
          <div className="mt-5 flex items-center gap-3 border-b border-white/[0.07] pb-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 font-bold">{thread.author.charAt(0).toUpperCase()}</div><div><p className="font-semibold">{thread.author}</p><p className="text-xs text-white/30">{thread.authorRole}</p></div></div>
          <p className="mt-6 whitespace-pre-wrap text-[17px] leading-8 text-white/72">{thread.content}</p>
          {thread.tags.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{thread.tags.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/40">#{tag}</span>)}</div>}
        </article>

        <section className="mt-7 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
          <h2 className="text-lg font-bold">Join the conversation</h2>
          <p className="mt-1 text-sm text-white/35">Posting as <strong className="text-white/65">{member?.name || 'your Koterie profile'}</strong>. Write in English as much as you can.</p>
          {replyingTo && <div className="mt-4 flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-200"><span className="inline-flex items-center gap-2"><Reply className="h-4 w-4" /> Replying to a comment</span><button onClick={() => setReplyingTo(null)} className="font-semibold">Cancel</button></div>}
          <form onSubmit={submitReply} className="mt-5 space-y-3"><textarea value={replyContent} onChange={(event) => setReplyContent(event.target.value)} placeholder="Write your reply…" rows={4} maxLength={1000} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 outline-none focus:border-purple-400/35" />{error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}<div className="flex justify-end"><button disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold transition hover:bg-purple-500 disabled:opacity-50"><Send className="h-4 w-4" /> {submitting ? 'Publishing…' : 'Publish reply'}</button></div></form>
        </section>

        <section className="mt-8 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Replies</h2><span className="text-xs text-white/30">{replies.length} total</span></div>{topLevel.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/35">No replies yet.</div>}{topLevel.map((reply) => <div key={reply.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="flex items-center justify-between gap-4"><div><p className="font-semibold">{reply.author}</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-white/25"><Clock className="h-3 w-3" /> {timeAgo(reply.createdAt)}</p></div><button onClick={() => setReplyingTo(reply.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300"><Reply className="h-3.5 w-3.5" /> Reply</button></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/65">{reply.content}</p>{(childrenByParent.get(reply.id) || []).map((child) => <div key={child.id} className="ml-4 mt-4 border-l border-purple-500/20 pl-4 sm:ml-8"><div className="flex items-center gap-2 text-xs"><span className="font-semibold text-purple-300">{child.author}</span><span className="text-white/20">{timeAgo(child.createdAt)}</span></div><p className="mt-2 text-sm leading-6 text-white/55">{child.content}</p></div>)}</div>)}</section>
      </div>
    </main>
  )
}
