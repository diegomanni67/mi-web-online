import { NextRequest, NextResponse } from 'next/server'
import { memberOrResponse, isResponse } from '@/lib/api-auth'

const ACADEMY_SYSTEM_PROMPT = `You are Koterie AI, the practice assistant for Koterie Academy. Learners are mainly A1-B1. Prefer English, give brief Spanish clarification only when needed, correct important mistakes without interrupting every sentence, and ask one natural follow-up question. Never invent grades, schedules or personal information.`
const STUDIO_SYSTEM_PROMPT = `You are Koterie AI, the practice assistant for Koterie Studio. Learners are B2-C2. Use natural advanced English, distinguish correct from more natural phrasing, correct errors that affect precision, and ask one challenging follow-up question. Never invent grades, schedules or personal information.`

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type ChatRequest = { messages: ChatMessage[]; forumType?: 'academy' | 'studio' }

export async function POST(req: NextRequest) {
  const member = await memberOrResponse(req)
  if (isResponse(member)) return member
  try {
    if (process.env.KOTERIE_AI_ENABLED !== 'true') {
      return NextResponse.json({ error: 'Koterie AI is disabled until the owner enables a provider.' }, { status: 503 })
    }

    const { messages, forumType = 'academy' } = await req.json() as ChatRequest
    if (forumType === 'studio' && member.access !== 'studio' && member.role === 'student') {
      return NextResponse.json({ error: 'Studio practice requires Studio access.' }, { status: 403 })
    }
    if (!Array.isArray(messages) || messages.length === 0) return NextResponse.json({ error: 'No messages provided' }, { status: 400 })

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Koterie AI is not configured yet.' }, { status: 503 })

    const systemPrompt = forumType === 'studio' ? STUDIO_SYSTEM_PROMPT : ACADEMY_SYSTEM_PROMPT
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood.' }] },
      ...messages.slice(-12).map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.content.slice(0, 4000) }] })),
    ]

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { temperature: forumType === 'studio' ? 0.75 : 0.65, maxOutputTokens: 700 } }),
    })
    if (!response.ok) return NextResponse.json({ error: 'Koterie AI is temporarily unavailable.' }, { status: 502 })
    const result = await response.json()
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) return NextResponse.json({ error: 'No response generated.' }, { status: 502 })
    return NextResponse.json({ message: text })
  } catch {
    return NextResponse.json({ error: 'Koterie AI could not process the request.' }, { status: 500 })
  }
}
