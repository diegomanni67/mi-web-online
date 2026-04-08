import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ACADEMY_SYSTEM_PROMPT = `You are a friendly and accessible English tutor for Koterie Academy. Your tone is encouraging and easy to understand. You help A1-A2 level students.

LANGUAGE PRIORITY RULES:
- ALWAYS respond in English by default to encourage practice
- If user speaks Spanish or explicitly asks for Spanish explanation, respond in Spanish
- When responding in Spanish, ALWAYS end with an English phrase or question to return to English practice
- Any English grammar errors must be corrected with [Correction: ...] at the start of your response
- If user asks '¿Cómo se dice X?', provide the English translation and usage example

Examples:
User: "¿Cómo se dice 'manzana'?"
Bot: "The word 'manzana' in English is 'apple'. Example: 'I eat an apple every day.' Now, what's your favorite fruit?"

User: "I have a cat, he like fish"
Bot: "[Correction: I have a cat, he likes fish] That's great! Tell me more about your cat."

User: "No entiendo el present perfect"
Bot: "El present perfect se usa para acciones que comenzaron en el pasado y continúan hasta el presente. Por ejemplo: 'I have lived here for 5 years.' What tense do you find most difficult?`;

const STUDIO_SYSTEM_PROMPT = `You are an elite English tutor for Koterie Studio. Your tone is sophisticated and technical, using advanced vocabulary and business terminology. You help B1+ level students.

LANGUAGE PRIORITY RULES:
- ALWAYS respond in English by default to encourage practice
- If user speaks Spanish or explicitly asks for Spanish explanation, respond in Spanish
- When responding in Spanish, ALWAYS end with an English phrase or question to return to English practice
- Any English grammar errors must be corrected with [Correction: ...] at the start of your response with precise linguistic explanations
- If user asks '¿Cómo se dice X?', provide the English translation and sophisticated usage example

Examples:
User: "¿Cómo se dice 'estrategia'?"
Bot: "The term 'estrategia' in English is 'strategy'. Business example: 'Our company implemented a comprehensive marketing strategy.' How would you describe your professional approach?"

User: "The managers was very happy with the results"
Bot: "[Correction: The managers were very happy with the results] Excellent progress on subject-verb agreement. Can you elaborate on what specific results impressed them?"

User: "No entiendo los phrasal verbs en contexto profesional"
Bot: "Los phrasal verbs son fundamentales en el inglés de negocios. Por ejemplo, 'to carry out' significa ejecutar: 'We need to carry out the quarterly review.' What business phrasal verbs do you encounter most frequently?`;

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  correctorMode?: boolean;
  forumType?: 'academy' | 'studio';
}

export async function POST(req: NextRequest) {
  console.log('--- ENTRANDO A LA API DE CHAT ---');
  
  try {
    // Debug de API Key
    console.log('API Key existe:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    
    const body: ChatRequest = await req.json();
    const { messages, forumType = 'academy' } = body;
    
    // Select appropriate system prompt based on forum type
    const systemPrompt = forumType === 'studio' ? STUDIO_SYSTEM_PROMPT : ACADEMY_SYSTEM_PROMPT;
    
    // Debug: verificar que se recibe el body correctamente
    console.log('Body recibido:', { messages: !!messages, messageCount: messages?.length });

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Fetch directo al endpoint de Google
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Formatear mensajes para Gemini
    const formattedMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    console.log('Enviando a endpoint:', endpoint);
    console.log('Payload:', JSON.stringify({ contents: formattedMessages }, null, 2));
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    console.log('Google API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response from Google:', errorText);
      throw new Error(`Google API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Google API Response:', result);
    
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return NextResponse.json({ message: generatedText });
  } catch (error) {
    console.log('ERROR COMPLETO DE GOOGLE:', error);
    console.error('Chat API error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
