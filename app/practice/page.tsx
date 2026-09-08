"use client"

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bot, Mic, Send, Sparkles, Volume2 } from 'lucide-react'

type Mode = 'academy' | 'studio'
type Message = { role: 'user' | 'assistant'; content: string }

const starters = {
  academy: [
    'Tell me about your week.',
    'Give me a short grammar exercise.',
    'Help me practise a conversation for travelling.',
  ],
  studio: [
    'Let’s debate whether remote work improves productivity.',
    'Correct my English and make it sound more natural.',
    'Give me a challenging speaking prompt.',
  ],
}

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>('academy')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const title = useMemo(() => mode === 'academy' ? 'Academy practice' : 'Studio practice', [mode])

  async function sendMessage(text = input) {
    const clean = text.trim()
    if (!clean || loading) return

    const nextMessages: Message[] = [...messages, { role: 'user', content: clean }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, forumType: mode }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error')

      setMessages([...nextMessages, { role: 'assistant', content: data.message }])
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Koterie AI is not available right now. You can keep your answer here and try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function startListening() {
    if (typeof window === 'undefined') return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('El reconocimiento de voz no está disponible en este navegador. Podés escribir tu respuesta.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false
    recognitionRef.current = recognition

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)
    }

    recognition.start()
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Volver al área de alumnos
        </Link>

        <div className="mt-7 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.08] bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-purple-300">
                  <Sparkles className="h-4 w-4" /> Koterie AI
                </div>
                <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Practice without waiting for the next class.</h1>
                <p className="mt-3 max-w-2xl leading-7 text-white/50">Escribí o hablá en inglés. La IA mantiene la conversación, corrige cuando vale la pena y adapta la exigencia según el espacio.</p>
              </div>
              <div className="flex rounded-2xl border border-white/10 bg-slate-950/60 p-1">
                {(['academy', 'studio'] as Mode[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => { setMode(option); setMessages([]) }}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${mode === option ? 'bg-purple-600 text-white' : 'text-white/45 hover:text-white'}`}
                  >
                    {option === 'academy' ? 'Academy' : 'Studio'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid min-h-[620px] lg:grid-cols-[1fr_260px]">
            <section className="flex min-h-[620px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
                {messages.length === 0 ? (
                  <div className="flex min-h-[390px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><Bot className="h-8 w-8" /></div>
                    <h2 className="mt-5 text-2xl font-bold">{title}</h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/45">Elegí una idea o empezá directamente con cualquier cosa que quieras practicar.</p>
                    <div className="mt-6 grid w-full max-w-xl gap-2">
                      {starters[mode].map((starter) => (
                        <button key={starter} onClick={() => sendMessage(starter)} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left text-sm text-white/70 transition hover:border-purple-400/25 hover:bg-white/[0.055] hover:text-white">
                          {starter}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${message.role === 'user' ? 'bg-purple-600 text-white' : 'border border-white/[0.08] bg-white/[0.045] text-white/80'}`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === 'assistant' && (
                          <button onClick={() => speak(message.content)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 transition hover:text-white">
                            <Volume2 className="h-3.5 w-3.5" /> Escuchar respuesta
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-3 text-sm text-white/45">Thinking…</div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.08] p-4 sm:p-5">
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2 focus-within:border-purple-400/35">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        sendMessage()
                      }
                    }}
                    rows={2}
                    placeholder="Write in English…"
                    className="min-h-[50px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                  />
                  <button onClick={startListening} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${listening ? 'bg-red-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`} aria-label="Hablar">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Enviar">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-2 px-1 text-[11px] text-white/25">Enter envía · Shift + Enter agrega una línea · el micrófono depende del navegador.</p>
              </div>
            </section>

            <aside className="border-t border-white/[0.08] bg-slate-950/35 p-5 lg:border-l lg:border-t-0">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/35">Cómo usarlo</h3>
              <div className="mt-5 space-y-5 text-sm leading-6 text-white/50">
                <div><strong className="block text-white/80">1. Hablá como puedas</strong>No esperes a formar una frase perfecta.</div>
                <div><strong className="block text-white/80">2. Mirá la corrección</strong>La IA prioriza los errores que más te ayudan.</div>
                <div><strong className="block text-white/80">3. Escuchá y repetí</strong>Usá el botón de audio para practicar ritmo y entonación.</div>
                <div><strong className="block text-white/80">4. Llevá dudas a clase</strong>La IA acompaña; tus profesoras siguen siendo la referencia.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
