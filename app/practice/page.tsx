"use client"

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bot, Mic, Send, Sparkles, Volume2 } from 'lucide-react'

type Mode = 'academy' | 'studio'
type Message = { role: 'user' | 'assistant'; content: string; local?: boolean }

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

const localFollowUps = {
  academy: [
    'Can you tell me one more detail?',
    'Why do you think that?',
    'What happened next?',
    'How did you feel about it?',
  ],
  studio: [
    'What is the strongest argument against your position?',
    'Can you give a concrete example?',
    'How would you explain that to someone who disagrees?',
    'What would change your mind?',
  ],
}

function localCoach(text: string, mode: Mode) {
  const corrections: Array<[RegExp, string, string]> = [
    [/\bi am agree\b/i, 'I agree', 'We say “I agree”, not “I am agree”.'],
    [/\bpeople is\b/i, 'people are', '“People” is plural.'],
    [/\bmore better\b/i, 'better', '“Better” is already comparative.'],
    [/\bi have (\d+) years\b/i, 'I am $1 years old', 'Age uses “be” in English.'],
    [/\bdepends of\b/i, 'depends on', 'The natural collocation is “depend on”.'],
    [/\bmarried with\b/i, 'married to', 'The usual preposition is “to”.'],
  ]

  const found = corrections.find(([pattern]) => pattern.test(text))
  const cleaned = found ? text.replace(found[0], found[1]) : text
  const index = Math.abs([...text].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % localFollowUps[mode].length
  const followUp = localFollowUps[mode][index]

  if (found) {
    return `Quick correction: ${found[2]}\n\nA more natural version is:\n“${cleaned}”\n\n${followUp}`
  }

  if (text.trim().split(/\s+/).length < 5) {
    return `Good start. Try to expand your answer with one reason or example.\n\n${followUp}`
  }

  return `Your answer is clear enough to keep the conversation moving. In local practice mode I only flag a small set of common mistakes, so I won't pretend to give full AI feedback.\n\n${followUp}`
}

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>('academy')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [providerOnline, setProviderOnline] = useState<boolean | null>(null)
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
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })), forumType: mode }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'offline')
      setProviderOnline(true)
      setMessages([...nextMessages, { role: 'assistant', content: data.message }])
    } catch {
      setProviderOnline(false)
      setMessages([...nextMessages, { role: 'assistant', content: localCoach(clean, mode), local: true }])
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
      for (let i = event.resultIndex; i < event.results.length; i += 1) transcript += event.results[i][0].transcript
      setInput(transcript)
    }
    recognition.start()
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/Quick correction:/g, ''))
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Student area</Link>

        <div className="mt-7 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.08] bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-purple-300"><Sparkles className="h-4 w-4" /> Practice Lab</div><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Practice without waiting for the next class.</h1><p className="mt-3 max-w-2xl leading-7 text-white/50">Speak or write in English. Browser speech tools work without paid APIs; full Koterie AI only activates when a provider is explicitly enabled.</p></div>
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end"><div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-slate-950/60 p-1 sm:flex">{(['academy','studio'] as Mode[]).map((option)=><button key={option} onClick={()=>{setMode(option);setMessages([])}} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${mode===option?'bg-purple-600 text-white':'text-white/45 hover:text-white'}`}>{option==='academy'?'Academy':'Studio'}</button>)}</div>{providerOnline !== null && <span className={`text-[11px] font-semibold ${providerOnline?'text-emerald-300':'text-amber-300'}`}>{providerOnline ? 'Koterie AI online' : 'Local practice mode · no API usage'}</span>}</div>
            </div>
          </div>

          <div className="grid min-h-[560px] lg:min-h-[620px] lg:grid-cols-[1fr_260px]">
            <section className="flex min-h-[560px] flex-col lg:min-h-[620px]">
              <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
                {messages.length===0 ? <div className="flex min-h-[330px] flex-col items-center justify-center text-center sm:min-h-[390px]"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><Bot className="h-8 w-8" /></div><h2 className="mt-5 text-2xl font-bold">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-white/45">Choose a starter or say anything you want to practise.</p><div className="mt-6 grid w-full max-w-xl gap-2">{starters[mode].map((starter)=><button key={starter} onClick={()=>sendMessage(starter)} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left text-sm text-white/70 transition hover:border-purple-400/25 hover:bg-white/[0.055]">{starter}</button>)}</div></div> : messages.map((message,index)=><div key={`${message.role}-${index}`} className={`flex ${message.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${message.role==='user'?'bg-purple-600 text-white':'border border-white/[0.08] bg-white/[0.045] text-white/80'}`}><p className="whitespace-pre-wrap">{message.content}</p>{message.role==='assistant' && <><button onClick={()=>speak(message.content)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300"><Volume2 className="h-3.5 w-3.5" /> Listen</button>{message.local && <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-amber-300/60">Local feedback · limited corrections</p>}</>}</div></div>)}
                {loading && <div className="flex justify-start"><div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-3 text-sm text-white/45">Thinking…</div></div>}
              </div>

              <div className="border-t border-white/[0.08] p-4 sm:p-5"><div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2 focus-within:border-purple-400/35"><textarea value={input} onChange={(event)=>setInput(event.target.value)} onKeyDown={(event)=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}}} rows={2} placeholder="Write in English…" className="min-h-[50px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/25"/><button onClick={startListening} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${listening?'bg-red-500':'bg-white/5 text-white/60 hover:bg-white/10'}`}><Mic className="h-5 w-5" /></button><button onClick={()=>sendMessage()} disabled={!input.trim()||loading} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 disabled:opacity-30"><Send className="h-5 w-5" /></button></div><p className="mt-2 px-1 text-[11px] text-white/25">Enter sends · Shift + Enter adds a line · speech recognition depends on the browser.</p></div>
            </section>

            <aside className="border-t border-white/[0.08] bg-slate-950/35 p-5 lg:border-l lg:border-t-0"><h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white/35">How to use it</h3><div className="mt-5 space-y-5 text-sm leading-6 text-white/50"><div><strong className="block text-white/80">1. Speak first</strong>Do not wait for a perfect sentence.</div><div><strong className="block text-white/80">2. Use the transcript</strong>Your microphone can turn speech into text.</div><div><strong className="block text-white/80">3. Listen and repeat</strong>Browser text-to-speech helps with rhythm.</div><div><strong className="block text-white/80">4. Full AI is optional</strong>No external provider is called unless Koterie explicitly enables one.</div></div></aside>
          </div>
        </div>
      </div>
    </main>
  )
}
