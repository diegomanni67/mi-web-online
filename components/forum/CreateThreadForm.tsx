"use client"

import { useState } from "react"
import { academyForumStorage, studioForumStorage } from "@/lib/forum-storage"
import { useMember } from "@/components/member/useMember"
import { Send, Tag, X } from "lucide-react"

interface CreateThreadFormProps {
  categoryId: string
  categoryName: string
  onBack: () => void
  onThreadCreated: (threadId: string) => void
  forumType?: 'academy' | 'studio'
}

export function CreateThreadForm({ categoryId, categoryName, onBack, onThreadCreated, forumType = 'academy' }: CreateThreadFormProps) {
  const forumStorage = forumType === 'academy' ? academyForumStorage : studioForumStorage
  const { member, loading: memberLoading } = useMember()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim() || !content.trim()) return setError('El título y el contenido son obligatorios.')
    setIsSubmitting(true)
    setError('')
    try {
      const newThread = await forumStorage.saveThread({
        title: title.trim(), content: content.trim(), author: member?.name || '', authorEmail: member?.email || '',
        authorRole: member?.role === 'teacher' ? 'Teacher' : member?.role === 'admin' ? 'Admin' : member?.access === 'studio' ? 'Studio member' : 'Academy member', category: categoryId,
        pinned: false, tags,
      })
      onThreadCreated(newThread.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos publicar el hilo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function addTag(event: React.KeyboardEvent) {
    if (event.key !== 'Enter' || !tagInput.trim()) return
    event.preventDefault()
    const value = tagInput.trim().toLowerCase()
    if (!tags.includes(value) && tags.length < 5) setTags((current) => [...current, value])
    setTagInput('')
  }

  if (forumType === 'studio' && !memberLoading && member && member.access !== 'studio' && member.role === 'student') {
    return <main className="min-h-screen bg-[#0a0f1e] p-10 text-center text-white"><p className="text-pink-200">Studio is read-only with Academy access.</p><button onClick={onBack} className="mt-5 text-purple-300">Go back</button></main>
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] p-6 text-white"><div className="mx-auto max-w-4xl"><button onClick={onBack} className="mb-7 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/65">← Back to {categoryName}</button><p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">{forumType}</p><h1 className="mt-2 text-3xl font-bold">Start a conversation</h1><p className="mt-2 text-white/40">Posting as {member?.name || 'your Koterie profile'}.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"><label className="mb-2 block text-sm font-medium text-white/70">Title *</label><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} className="mb-6 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none focus:border-purple-400/40" placeholder="Write a clear title..."/><label className="mb-2 block text-sm font-medium text-white/70">What do you want to say? *</label><textarea value={content} onChange={(event) => setContent(event.target.value)} rows={8} maxLength={2000} className="mb-6 w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 outline-none focus:border-purple-400/40" placeholder="Write in English as much as you can."/><label className="mb-2 block text-sm font-medium text-white/70">Tags <span className="text-white/30">(optional)</span></label>{tags.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="flex items-center gap-2 rounded-full bg-purple-500/15 px-3 py-1.5 text-xs font-semibold text-purple-300"><Tag className="h-3 w-3" />{tag}<button type="button" onClick={() => setTags((current) => current.filter((item) => item !== tag))}><X className="h-3 w-3" /></button></span>)}</div>}<input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={addTag} disabled={tags.length >= 5} className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none focus:border-purple-400/40" placeholder="Type a tag and press Enter"/>{error && <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}<div className="mt-6 flex justify-end"><button disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold disabled:opacity-50"><Send className="h-4 w-4" />{isSubmitting ? 'Publishing…' : 'Publish'}</button></div></form></div></main>
  )
}
