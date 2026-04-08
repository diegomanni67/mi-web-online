"use client"

import { useState } from "react"
import { PostCard } from "./PostCard"

interface ForumFeedProps {
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
  }>
  searchTerm: string
  onSearchChange: (term: string) => void
  onPostClick: (postId: number) => void
}

export function ForumFeed({ posts, searchTerm, onSearchChange, onPostClick }: ForumFeedProps) {
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
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
            post.category === 'general' ? 'bg-blue-100 text-blue-800 border-blue-200' :
            post.category === 'grammar' ? 'bg-green-100 text-green-800 border-green-200' :
            post.category === 'vocabulary' ? 'bg-purple-100 text-purple-800 border-purple-200' :
            post.category === 'practice' ? 'bg-orange-100 text-orange-800 border-orange-200' :
            'bg-gray-100 text-gray-800 border-gray-200'
          }
          onClick={() => onPostClick(post.id)}
        />
      ))}
    </div>
  )
}
