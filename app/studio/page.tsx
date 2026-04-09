"use client"

// VERSIÓN LOCAL ABIERTA - SIN LOGIN REQUERIDO

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Trash2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function StudioPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
  useEffect(() => {
    // Sin verificaciones de sesión en versión local
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const clearConversation = () => {
    setMessages([])
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      if (data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // You could show an error message to the user here
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // VERSIÓN LOCAL ABIERTA - ACCESO DIRECTO
  if (false) { // No mostrar loading en versión local

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-[oklch(0.72_0.19_220/0.12)] blur-[120px]" />
        <div className="absolute -right-32 top-1/3 size-[400px] rounded-full bg-[oklch(0.72_0.22_350/0.1)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[450px] rounded-full bg-[oklch(0.75_0.18_55/0.08)] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  Volver
                </button>
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                    Koterie AI Tutor
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Your elegant British English tutor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Clear Conversation */}
                <button
                  onClick={clearConversation}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground transition-all"
                >
                  <Trash2 className="size-4" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <AlertCircle className="size-8 text-blue-500" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Welcome to Koterie AI Tutor
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    I'm here to help you improve your British English. Ask me anything!
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-sm text-green-500">
                    Auto-correction: Active
                  </div>
                </div>
              )}

              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] text-white'
                        : 'bg-secondary/80 border border-border/50 text-foreground'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl bg-secondary/80 border border-border/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Koterie is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message in English..."
                  className="flex-1 rounded-xl border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-gradient-to-r from-[oklch(0.72_0.19_220)] via-[oklch(0.72_0.22_350)] to-[oklch(0.75_0.18_55)] px-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)] transition-all duration-300"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
}
