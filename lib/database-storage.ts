import { supabase } from './supabase'
import { ForumThread, ForumReply, DownloadLink } from './forum-storage'

export interface DatabaseForumThread {
  id: string
  title: string
  content: string
  author: string
  author_email: string
  author_role: string
  category: string
  created_at: string
  updated_at: string
  replies: number
  views: number
  pinned: boolean
  tags: string[]
}

export interface DatabaseForumReply {
  id: string
  thread_id: string
  content: string
  author: string
  author_email: string
  author_role: string
  created_at: string
  likes: number
  parent_id?: string
}

export interface DatabaseMaterialLink {
  id: string
  name: string
  url: string
  added_by: string
  subcategory_id: string
  added_at: string
}

class DatabaseStorage {
  // Threads
  async getThreads(category?: string): Promise<ForumThread[]> {
    let query = supabase
      .from('forum_threads')
      .select('*')
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching threads:', error)
      return []
    }

    return data.map(this.mapDatabaseThreadToForumThread)
  }

  async saveThread(thread: Omit<ForumThread, 'id' | 'createdAt' | 'updatedAt' | 'replies' | 'views'>): Promise<ForumThread> {
    const newThread = {
      title: thread.title,
      content: thread.content,
      author: thread.author,
      author_email: thread.authorEmail,
      author_role: thread.authorRole,
      category: thread.category,
      tags: thread.tags,
      pinned: false,
      replies: 0,
      views: 0
    }

    const { data, error } = await supabase
      .from('forum_threads')
      .insert(newThread)
      .select()
      .single()

    if (error) {
      console.error('Error saving thread:', error)
      throw error
    }

    return this.mapDatabaseThreadToForumThread(data)
  }

  async getThread(id: string): Promise<ForumThread | null> {
    const { data, error } = await supabase
      .from('forum_threads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching thread:', error)
      return null
    }

    return this.mapDatabaseThreadToForumThread(data)
  }

  async updateThreadViews(id: string): Promise<void> {
    const { error } = await supabase
      .from('forum_threads')
      .update({ 
        views: supabase.rpc('increment', { column_name: 'views', table_name: 'forum_threads', row_id: id }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating thread views:', error)
    }
  }

  // Replies
  async getReplies(threadId: string): Promise<ForumReply[]> {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching replies:', error)
      return []
    }

    return data.map(this.mapDatabaseReplyToForumReply)
  }

  async saveReply(reply: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>): Promise<ForumReply> {
    const newReply = {
      thread_id: reply.threadId,
      content: reply.content,
      author: reply.author,
      author_email: reply.authorEmail,
      author_role: reply.authorRole,
      likes: 0,
      parent_id: reply.parentId
    }

    const { data, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single()

    if (error) {
      console.error('Error saving reply:', error)
      throw error
    }

    // Update thread reply count
    await supabase
      .from('forum_threads')
      .update({ 
        replies: supabase.rpc('increment', { column_name: 'replies', table_name: 'forum_threads', row_id: reply.threadId }),
        updated_at: new Date().toISOString()
      })
      .eq('id', reply.threadId)

    return this.mapDatabaseReplyToForumReply(data)
  }

  // Material Links
  async getMaterialLinks(subcategoryId: string): Promise<DownloadLink[]> {
    const { data, error } = await supabase
      .from('material_links')
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Error fetching material links:', error)
      return []
    }

    return data.map(this.mapDatabaseLinkToDownloadLink)
  }

  async addMaterialLink(subcategoryId: string, link: Omit<DownloadLink, 'addedAt'>): Promise<void> {
    const newLink = {
      name: link.name,
      url: link.url,
      added_by: link.addedBy,
      subcategory_id: subcategoryId
    }

    const { error } = await supabase
      .from('material_links')
      .insert(newLink)

    if (error) {
      console.error('Error adding material link:', error)
      throw error
    }
  }

  // Helper methods to map between database and local types
  private mapDatabaseThreadToForumThread(data: DatabaseForumThread): ForumThread {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.author,
      authorEmail: data.author_email,
      authorRole: data.author_role,
      category: data.category,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      replies: data.replies,
      views: data.views,
      pinned: data.pinned,
      tags: data.tags
    }
  }

  private mapDatabaseReplyToForumReply(data: DatabaseForumReply): ForumReply {
    return {
      id: data.id,
      threadId: data.thread_id,
      content: data.content,
      author: data.author,
      authorEmail: data.author_email,
      authorRole: data.author_role,
      createdAt: new Date(data.created_at),
      likes: data.likes,
      parentId: data.parent_id
    }
  }

  private mapDatabaseLinkToDownloadLink(data: DatabaseMaterialLink): DownloadLink {
    return {
      name: data.name,
      url: data.url,
      addedBy: data.added_by,
      addedAt: new Date(data.added_at)
    }
  }
}

export const databaseStorage = new DatabaseStorage()
