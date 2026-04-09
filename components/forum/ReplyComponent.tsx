"use client"

import { ForumReply } from "@/lib/forum-storage"
import { useSession } from "next-auth/react"
import { Clock, User, Reply, Heart, ChevronDown, ChevronUp } from "lucide-react"

interface ReplyComponentProps {
  reply: ForumReply
  threadId: string
  session: any
  onReply: (replyId: string) => void
  nestedReplies: ForumReply[]
  expandedReplies: Set<string>
  onToggleExpanded: (replyId: string) => void
  formatTimeAgo: (date: Date) => string
  isNested?: boolean
}

export function ReplyComponent({
  reply,
  threadId,
  session,
  onReply,
  nestedReplies,
  expandedReplies,
  onToggleExpanded,
  formatTimeAgo,
  isNested = false
}: ReplyComponentProps) {
  const hasNestedReplies = nestedReplies.length > 0
  const isExpanded = expandedReplies.has(reply.id)

  return (
    <div className={`${isNested ? 'ml-8 border-l-2 border-purple-500/30 pl-6' : ''}`}>
      <div className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 ${isNested ? 'bg-purple-500/5' : ''}`}>
        {/* Reply Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isNested ? 'bg-purple-500/20' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
              <span className={`text-sm font-bold ${isNested ? 'text-purple-400' : 'text-white'}`}>
                {reply.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isNested ? 'text-purple-400' : 'text-white'}`}>
                  {reply.author}
                </span>
                <span className="text-sm text-gray-600">({reply.authorRole})</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(reply.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            {session && (
              <button
                onClick={() => onReply(reply.id)}
                className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                title="Responder"
              >
                <Reply className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Reply Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {reply.content}
          </p>
        </div>

        {/* Nested Replies Toggle */}
        {hasNestedReplies && (
          <button
            onClick={() => onToggleExpanded(reply.id)}
            className="mt-4 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Ocultar {nestedReplies.length} respuesta{nestedReplies.length !== 1 ? 's' : ''}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Ver {nestedReplies.length} respuesta{nestedReplies.length !== 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Nested Replies */}
      {hasNestedReplies && isExpanded && (
        <div className="mt-4 space-y-4">
          {nestedReplies.map((nestedReply) => (
            <ReplyComponent
              key={nestedReply.id}
              reply={nestedReply}
              threadId={threadId}
              session={session}
              onReply={onReply}
              nestedReplies={[]} // Support one level of nesting for now
              expandedReplies={expandedReplies}
              onToggleExpanded={onToggleExpanded}
              formatTimeAgo={formatTimeAgo}
              isNested={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
