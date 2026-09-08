"use client"

import { useState } from "react"
import { academyForumStorage, studioForumStorage } from "@/lib/forum-storage"
import { X, Send, Tag, User } from "lucide-react"

interface CreateThreadFormProps {
  categoryId: string
  categoryName: string
  onBack: () => void
  onThreadCreated: (threadId: string) => void
  forumType?: 'academy' | 'studio'
}

export function CreateThreadForm({ categoryId, categoryName, onBack, onThreadCreated, forumType = 'academy' }: CreateThreadFormProps) {
  const forumStorage = forumType === 'academy' ? academyForumStorage : studioForumStorage
  const [authorName, setAuthorName] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorName.trim() || !title.trim() || !content.trim()) {
      setError("Tu nombre, el título y el contenido son obligatorios")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const newThread = await forumStorage.saveThread({
        title: title.trim(),
        content: content.trim(),
        author: authorName.trim(),
        authorEmail: "",
        authorRole: forumType === 'studio' ? "Studio member" : "Academy member",
        category: categoryId,
        pinned: false,
        tags,
      })

      onThreadCreated(newThread.id)
    } catch {
      setError("No pudimos publicar el hilo. Intentá nuevamente.")
      setIsSubmitting(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => setTags(tags.filter((tag) => tag !== tagToRemove))

  return (
    <main className="min-h-screen bg-[#0a0f1e] p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <button onClick={onBack} className="mb-7 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">
          ← Back to {categoryName}
        </button>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">{forumType === 'studio' ? 'Studio' : 'Academy'}</p>
          <h1 className="mt-2 text-3xl font-bold">Start a conversation</h1>
          <p className="mt-2 text-white/45">Share a question, opinion, recommendation or experience with the Koterie community.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
          <div className="mb-6">
            <label htmlFor="author" className="mb-2 block text-sm font-medium text-white/70">Your name *</label>
            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-3 focus-within:border-purple-400/40">
              <User className="h-4 w-4 text-white/30" />
              <input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="How should the community see your name?" className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/25" maxLength={60} />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-white/70">Title *</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Write a clear title..." className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none transition focus:border-purple-400/40" maxLength={100} />
            <p className="mt-1 text-xs text-white/25">{title.length}/100</p>
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="mb-2 block text-sm font-medium text-white/70">What do you want to say? *</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write in English as much as you can. It does not need to be perfect." rows={8} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-400/40" maxLength={2000} />
            <p className="mt-1 text-xs text-white/25">{content.length}/2000</p>
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="mb-2 block text-sm font-medium text-white/70">Tags <span className="text-white/30">(optional)</span></label>
            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-2 rounded-full bg-purple-500/15 px-3 py-1.5 text-xs font-semibold text-purple-300">
                    <Tag className="h-3 w-3" /> {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
            <input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type a tag and press Enter" className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none transition focus:border-purple-400/40" disabled={tags.length >= 5} />
          </div>

          {error && <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onBack} className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting || !authorName.trim() || !title.trim() || !content.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? 'Publishing…' : <><Send className="h-4 w-4" /> Publish</>}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
