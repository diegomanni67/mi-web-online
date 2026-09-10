export interface ForumThread {
  id: string
  title: string
  content: string
  author: string
  authorEmail: string
  authorRole: string
  category: string
  createdAt: Date
  updatedAt: Date
  replies: number
  views: number
  pinned: boolean
  tags: string[]
}

export interface ForumReply {
  id: string
  threadId: string
  content: string
  author: string
  authorEmail: string
  authorRole: string
  createdAt: Date
  likes: number
  parentId?: string
}

export interface DownloadLink {
  name: string
  url: string
  addedBy: string
  addedAt: Date
}

function hydrateThread(raw: any): ForumThread {
  return { ...raw, createdAt: new Date(raw.createdAt), updatedAt: new Date(raw.updatedAt), tags: raw.tags || [] }
}
function hydrateReply(raw: any): ForumReply {
  return { ...raw, createdAt: new Date(raw.createdAt) }
}

class ForumStorage {
  async getThreads(category?: string): Promise<ForumThread[]> {
    const params = new URLSearchParams({ space: 'all' })
    if (category) params.set('category', category)
    const response = await fetch(`/api/forum/threads?${params.toString()}`, { cache: 'no-store' })
    if (!response.ok) throw new Error('Could not load discussions')
    const data = await response.json()
    return (data.threads || []).map(hydrateThread)
  }

  async saveThread(thread: Omit<ForumThread, 'id' | 'createdAt' | 'updatedAt' | 'replies' | 'views'>): Promise<ForumThread> {
    const response = await fetch('/api/forum/threads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        space: 'academy', category: thread.category,
        title: thread.title, content: thread.content, tags: thread.tags,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not publish discussion')
    return hydrateThread(data.thread)
  }

  async getThread(id: string): Promise<ForumThread | null> {
    const response = await fetch(`/api/forum/threads/${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Could not load discussion')
    const data = await response.json()
    return hydrateThread(data.thread)
  }

  async updateThreadViews(id: string): Promise<void> {
    await fetch(`/api/forum/threads/${encodeURIComponent(id)}`, { method: 'PATCH' })
  }

  async getReplies(threadId: string): Promise<ForumReply[]> {
    const response = await fetch(`/api/forum/replies?threadId=${encodeURIComponent(threadId)}`, { cache: 'no-store' })
    if (!response.ok) throw new Error('Could not load replies')
    const data = await response.json()
    return (data.replies || []).map(hydrateReply)
  }

  async saveReply(reply: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>): Promise<ForumReply> {
    const response = await fetch('/api/forum/replies', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: reply.threadId,
        content: reply.content, parentId: reply.parentId,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not publish reply')
    return hydrateReply(data.reply)
  }

  async getMaterialLinks(_subcategoryId: string): Promise<DownloadLink[]> { return [] }
  async addMaterialLink(): Promise<void> { throw new Error('Materials are managed by teachers') }
}

export const forumStorage = new ForumStorage()
export const academyForumStorage = forumStorage
export const studioForumStorage = forumStorage
