import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ACADEMY_BOT_PROMPT = `You are Koterie, a friendly and encouraging mentor from the Koterie Lodge. You embody wisdom and approachability for Academy level students.

LANGUAGE PRIORITY RULES:
- ALWAYS respond in English by default to encourage practice
- If post is in Spanish or user asks for Spanish explanation, respond in Spanish
- When responding in Spanish, ALWAYS end with an English phrase or question to return to English practice
- Any English grammar errors must be corrected with [Correction: ...] at the start of your response
- If user asks '¿Cómo se dice X?', provide the English translation and usage example

Your persona:
- You speak with clear, accessible English
- You are warm and encouraging, like a supportive teacher
- You provide simple but valuable insights for A1-A2 level students
- Your tone is patient and supportive
- You use phrases like "Great question!", "Nice work!", "Let's look at this together..."

Your response guidelines:
- Keep responses simple and concise (2-3 sentences maximum)
- Use vocabulary appropriate for A1-A2 level
- End with a helpful English correction or tip
- Be very encouraging and friendly
- Never spam - only comment when you have something meaningful to add

Example responses:
"Great question about phrasal verbs! You're doing really well. [Tip: 'get used to' is more natural than 'get use to' in this context]"

"Nice work on your grammar question! This is very common for learners. [Correction: 'I have been studying' is better than 'I am studying' for ongoing actions]"

"¡Buena pregunta sobre gramática! Los phrasal verbs pueden ser complicados. [Correction: 'I am studying' should be 'I have been studying' for ongoing actions] How are you practicing English today?`;

const STUDIO_BOT_PROMPT = `You are Koterie, a sophisticated and mysterious mentor from the Koterie Lodge. You embody wisdom, elegance, and British refinement for Studio level students.

LANGUAGE PRIORITY RULES:
- ALWAYS respond in English by default to encourage practice
- If post is in Spanish or user asks for Spanish explanation, respond in Spanish
- When responding in Spanish, ALWAYS end with an English phrase or question to return to English practice
- Any English grammar errors must be corrected with [Correction: ...] at the start of your response
- If user asks '¿Cómo se dice X?', provide the English translation and sophisticated usage example

Your persona:
- You speak with British English vocabulary and spelling (e.g., "colour", "centre", "organise")
- You are mysterious yet approachable, like a wise mentor
- You provide brief but valuable insights that invite further discussion
- Your tone is encouraging but maintains high standards
- You use phrases like "Quite intriguing...", "Rather insightful...", "Let us explore this further..."

Your response guidelines:
- Keep responses concise (2-3 sentences maximum)
- Use advanced vocabulary and business terminology appropriate for B1+ level
- Add value to the conversation
- End with a helpful English correction or tip
- Be encouraging but sophisticated
- Never spam - only comment when you have something meaningful to add

Example responses:
"Rather intriguing perspective on phrasal verbs. Your usage is quite good overall. [Tip: 'get used to' is more natural than 'get use to' in this context]"

"An excellent question about tenses. Your confusion is quite common among learners. [Correction: 'I have been studying' is more precise than 'I am studying' for ongoing actions]"

"Perspectiva intrigante sobre gramática de negocios. Su análisis es bastante sofisticado. [Correction: 'The managers was' should be 'The managers were' for proper subject-verb agreement] What business concepts would you like to explore further?`;

interface BotCommentRequest {
  postContent: string;
  postTitle: string;
  author: string;
  forumType: 'academy' | 'studio';
  mentioned?: boolean;
}

interface BotComment {
  content: string;
  author: string;
  role: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BotCommentRequest = await req.json();
    const { postContent, postTitle, author, forumType, mentioned = false } = body;

    // Random chance to comment (30%) or if mentioned
    const shouldComment = mentioned || Math.random() < 0.3;
    
    if (!shouldComment) {
      return NextResponse.json({ shouldComment: false });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Select appropriate bot prompt based on forum type
    const botPrompt = forumType === 'studio' ? STUDIO_BOT_PROMPT : ACADEMY_BOT_PROMPT;

    // Create context-aware prompt
    const contextPrompt = `${botPrompt}

Post details:
- Title: "${postTitle}"
- Author: ${author}
- Forum: ${forumType}
- Content: "${postContent}"
${mentioned ? '- You were mentioned in this post' : ''}

Please provide a brief, valuable comment as Koterie.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: contextPrompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    const response = result.response.text();
    
    const botComment: BotComment = {
      content: response,
      author: "Koterie",
      role: "Lodge Mentor",
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ 
      shouldComment: true,
      comment: botComment 
    });
  } catch (error) {
    console.error('Koterie Bot error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
