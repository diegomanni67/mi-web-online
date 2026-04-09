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

class ForumStorage {
  private threadsKey = 'forum_threads'
  private repliesKey = 'forum_replies'
  private materialLinksKey = 'material_links'

  // Threads
  getThreads(category?: string): ForumThread[] {
    if (typeof window === 'undefined') return []
    
    const threads = JSON.parse(localStorage.getItem(this.threadsKey) || '[]')
    const parsedThreads = threads.map((thread: any) => ({
      ...thread,
      createdAt: new Date(thread.createdAt),
      updatedAt: new Date(thread.updatedAt)
    }))
    
    if (category) {
      return parsedThreads.filter((thread: ForumThread) => thread.category === category)
    }
    return parsedThreads
  }

  saveThread(thread: Omit<ForumThread, 'id' | 'createdAt' | 'updatedAt' | 'replies' | 'views'>): ForumThread {
    if (typeof window === 'undefined') throw new Error('Cannot save on server')
    
    const threads = this.getThreads()
    const newThread: ForumThread = {
      ...thread,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: 0,
      views: 0
    }
    
    threads.push(newThread)
    localStorage.setItem(this.threadsKey, JSON.stringify(threads))
    return newThread
  }

  getThread(id: string): ForumThread | null {
    const threads = this.getThreads()
    return threads.find(thread => thread.id === id) || null
  }

  updateThreadViews(id: string): void {
    if (typeof window === 'undefined') return
    
    const threads = this.getThreads()
    const threadIndex = threads.findIndex(thread => thread.id === id)
    if (threadIndex !== -1) {
      threads[threadIndex].views++
      threads[threadIndex].updatedAt = new Date()
      localStorage.setItem(this.threadsKey, JSON.stringify(threads))
    }
  }

  // Replies
  getReplies(threadId: string): ForumReply[] {
    if (typeof window === 'undefined') return []
    
    const replies = JSON.parse(localStorage.getItem(this.repliesKey) || '[]')
    return replies
      .filter((reply: any) => reply.threadId === threadId)
      .map((reply: any) => ({
        ...reply,
        createdAt: new Date(reply.createdAt)
      }))
      .sort((a: ForumReply, b: ForumReply) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  saveReply(reply: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>): ForumReply {
    if (typeof window === 'undefined') throw new Error('Cannot save on server')
    
    const replies = JSON.parse(localStorage.getItem(this.repliesKey) || '[]')
    const newReply: ForumReply = {
      ...reply,
      id: Date.now().toString(),
      createdAt: new Date(),
      likes: 0
    }
    
    replies.push(newReply)
    localStorage.setItem(this.repliesKey, JSON.stringify(replies))
    
    // Update thread reply count
    const threads = this.getThreads()
    const threadIndex = threads.findIndex(thread => thread.id === reply.threadId)
    if (threadIndex !== -1) {
      threads[threadIndex].replies++
      threads[threadIndex].updatedAt = new Date()
      localStorage.setItem(this.threadsKey, JSON.stringify(threads))
    }
    
    return newReply
  }

  // Material Links
  getMaterialLinks(subcategoryId: string): DownloadLink[] {
    if (typeof window === 'undefined') return []
    
    const links = JSON.parse(localStorage.getItem(this.materialLinksKey) || '[]')
    return links
      .filter((link: any) => link.subcategoryId === subcategoryId)
      .map((link: any) => ({
        ...link,
        addedAt: new Date(link.addedAt)
      }))
  }

  addMaterialLink(subcategoryId: string, link: Omit<DownloadLink, 'addedAt'>): void {
    if (typeof window === 'undefined') return
    
    const links = JSON.parse(localStorage.getItem(this.materialLinksKey) || '[]')
    const newLink = {
      ...link,
      subcategoryId,
      addedAt: new Date()
    }
    
    links.push(newLink)
    localStorage.setItem(this.materialLinksKey, JSON.stringify(links))
  }
}

export const forumStorage = new ForumStorage()
