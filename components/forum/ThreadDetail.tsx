"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { forumStorage, ForumThread, ForumReply } from "@/lib/forum-storage"
import { ArrowLeft, MessageCircle, Heart, Clock, User, Send, Pin, Reply, ChevronDown, ChevronUp } from "lucide-react"
import { ReplyComponent } from "./ReplyComponent"

interface ThreadDetailProps {
  threadId: string
  onBack: () => void
}

export function ThreadDetail({ threadId, onBack }: ThreadDetailProps) {
  const { data: session } = useSession()
  const [thread, setThread] = useState<ForumThread | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadThread = () => {
      const threadData = forumStorage.getThread(threadId)
      if (threadData) {
        setThread(threadData)
        setReplies(forumStorage.getReplies(threadId))
      }
    }

    loadThread()
  }, [threadId])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      setError("Debes iniciar sesión para responder")
      return
    }

    if (!replyContent.trim()) {
      setError("El contenido de la respuesta es obligatorio")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const newReply = forumStorage.saveReply({
        threadId,
        content: replyContent.trim(),
        author: session.user.name || "Anonymous",
        authorEmail: session.user.email || "",
        authorRole: session.user.role || "Student",
        parentId: replyingTo || undefined
      })

      setReplies([...replies, newReply])
      setReplyContent("")
      setReplyingTo(null)
      
      // Update thread reply count
      if (thread) {
        setThread({
          ...thread,
          replies: thread.replies + 1,
          updatedAt: new Date()
        })
      }
    } catch (err) {
      setError("Error al enviar respuesta. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleExpanded = (replyId: string) => {
    const newExpanded = new Set(expandedReplies)
    if (newExpanded.has(replyId)) {
      newExpanded.delete(replyId)
    } else {
      newExpanded.add(replyId)
    }
    setExpandedReplies(newExpanded)
  }

  const getNestedReplies = (parentId: string) => {
    return replies.filter(reply => reply.parentId === parentId)
  }

  const getTopLevelReplies = () => {
    return replies.filter(reply => !reply.parentId)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    } else if (diffInHours > 0) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    } else {
      return "Hace unos minutos"
    }
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando hilo...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a hilos</span>
          </span>
        </button>

        {/* Thread Title Header */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {thread.pinned && (
              <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                <Pin className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Fijado</span>
              </div>
            )}
            <h1 className="text-3xl font-bold text-white flex-1">
              {thread.title}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{thread.author.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <span className="font-medium text-purple-400">{thread.author}</span>
                <span className="text-gray-600 ml-1">({thread.authorRole})</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTimeAgo(thread.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{thread.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{thread.views}</span>
              </div>
            </div>
          </div>

          {thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {thread.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Original Post Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{thread.author.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{thread.author}</span>
                <span className="text-sm text-gray-500">({thread.authorRole})</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{formatTimeAgo(thread.createdAt)}</span>
              </div>
              <div className="text-xs text-purple-400 font-medium">Autor del hilo</div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none ml-16">
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
              {thread.content}
            </p>
          </div>
        </div>

        {/* Reply Form - Always Visible */}
        {session && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8 sticky bottom-4">
            {replyingTo && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <Reply className="w-4 h-4" />
                  <span>Respondiendo a un comentario</span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
            
            <h3 className="text-lg font-semibold text-white mb-4">
              {replyingTo ? "Escribe tu respuesta" : "Participa en la discusión"}
            </h3>
            
            <form onSubmit={handleReply} className="space-y-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={replyingTo ? "Escribe tu respuesta al comentario..." : "Comparte tu opinión sobre este tema..."}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:border-purple-500/50 focus:outline-none transition-all duration-300 placeholder-gray-500 resize-none"
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {replyContent.length}/1000 caracteres
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {replyingTo ? "Responder" : "Publicar"}
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Replies Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Discusión ({replies.length} respuesta{replies.length !== 1 ? 's' : ''})
            </h3>
          </div>

          {replies.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-400 mb-2">
                {session ? "Sé el primero en participar" : "Inicia sesión para unirte a la discusión"}
              </h4>
              <p className="text-gray-500">
                Comparte tu opinión y ayuda a construir una comunidad activa
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getTopLevelReplies().map((reply) => (
                <ReplyComponent
                  key={reply.id}
                  reply={reply}
                  threadId={threadId}
                  session={session}
                  onReply={setReplyingTo}
                  nestedReplies={getNestedReplies(reply.id)}
                  expandedReplies={expandedReplies}
                  onToggleExpanded={toggleExpanded}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
