import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ACADEMY_SYSTEM_PROMPT = `You are Koterie AI, the practice assistant for Koterie Academy.
Your learners are mainly A1-B1 English students.

Your job:
- Keep the conversation useful, warm and age-appropriate for adults and teenagers.
- Prefer English, but explain briefly in Spanish when the learner asks in Spanish or is clearly stuck.
- Correct important mistakes without interrupting every sentence.
- Use this format when correction helps: "Quick correction: ..." followed by one short explanation.
- Ask one natural follow-up question so the learner keeps speaking or writing.
- Adapt vocabulary and sentence length to the learner's level.
- Do not pretend to be a human teacher or replace the student's real teacher.
- Do not invent grades, attendance, class schedules or personal information.

When the learner asks for an exercise, create a short exercise and wait for the answer before giving the solution.
When the learner asks how to say something, give the natural English phrase plus one realistic example.`

const STUDIO_SYSTEM_PROMPT = `You are Koterie AI, the practice assistant for Koterie Studio.
Your learners are B2-C2 English users who want greater fluency, precision and confidence.

Your job:
- Speak primarily in English unless the learner explicitly asks for Spanish clarification.
- Use natural advanced English, not unnecessarily obscure vocabulary.
- Correct errors that affect accuracy, nuance or naturalness.
- When useful, distinguish between "correct" and "more natural" English.
- Encourage discussion, argument, storytelling, professional communication and real-world conversation.
- Ask one challenging but relevant follow-up question after each answer.
- Do not pretend to be a human teacher or replace the student's real teacher.
- Do not invent grades, attendance, class schedules or personal information.

When the learner asks for pronunciation help, provide stress guidance and a simple phonetic approximation when useful, then give a short sentence to practise aloud.`

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  forumType?: 'academy' | 'studio'
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    const { messages, forumType = 'academy' } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Koterie AI is not configured yet.' },
        { status: 503 }
      )
    }

    const systemPrompt = forumType === 'studio' ? STUDIO_SYSTEM_PROMPT : ACADEMY_SYSTEM_PROMPT
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will act as Koterie AI and follow those instructions.' }],
      },
      ...messages.slice(-12).map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      })),
    ]

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: forumType === 'studio' ? 0.75 : 0.65,
          maxOutputTokens: 900,
        },
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Koterie AI is temporarily unavailable.' },
        { status: 502 }
      )
    }

    const result = await response.json()
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!generatedText) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 502 })
    }

    return NextResponse.json({ message: generatedText })
  } catch {
    return NextResponse.json(
      { error: 'Koterie AI could not process the request.' },
      { status: 500 }
    )
  }
}
