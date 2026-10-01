import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.DATA_GEMINI_API_KEY;
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, reply: 'Invalid request format. Messages array is required.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean conversation history: ensure starting with 'user' and alternating roles
    const userFirstIndex = messages.findIndex((m: any) => m.role === 'user');
    const validMessages = userFirstIndex >= 0 ? messages.slice(userFirstIndex) : messages;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const m of validMessages) {
      const role = m.role === 'user' ? 'user' : 'model';
      if (!m.content || typeof m.content !== 'string') continue;
      
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += '\n\n' + m.content;
      } else {
        contents.push({ role, parts: [{ text: m.content }] });
      }
    }

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const systemInstruction = `You are Advocate Aastha's AI Legal Assistant on the "Nyaya Aastha" digital portal (Advocate Aastha, ENR No. 3475/2026, Bihar State Bar Council).

CRITICAL RULE - NO REPETITIVE INTRODUCTIONS:
- DO NOT introduce yourself or say "Hello! I am Advocate Aastha's AI...", "Welcome to Nyaya Aastha...", or "As Advocate Aastha's assistant...".
- The user ALREADY sees your identity in the UI header. Jump STRAIGHT into answering their specific question in the very first sentence!

Your Communication Style & Persona:
1. Direct & Conversational: Jump straight into the answer immediately. Respond naturally like an approachable legal advisor in an ongoing conversation.
2. Clear & Readable: Answer the user's specific query in 2 to 3 clear, easy-to-read paragraphs or short bullet points (covering Indian laws like BNS 2023, DPDP Act 2023, RERA, Property, Civil, Criminal, Family, Labour, Cyber Law).
3. Natural Follow-up: Conclude naturally with a brief, relevant follow-up question (e.g., "Would you like to know more about this?", "Do you have a specific case detail?") to keep the conversation flowing smoothly.
4. Professional Consultation Guidance: When relevant, suggest using the "Client Portal" on this site to upload case files or book a formal consultation with Advocate Aastha.
5. Subtle Disclaimer: Include a short, natural BCI legal disclaimer at the very end when appropriate.`;

    // gemini-3.5-flash-lite provides sub-second response times (~600ms)
    const FAST_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];
    let responseText = '';

    for (const modelName of FAST_MODELS) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            maxOutputTokens: 1000,
            temperature: 0.7
          }
        });

        if (res && res.text) {
          responseText = res.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[Gemini API] ${modelName} attempt failed:`, err?.message);
      }
    }

    if (!responseText) {
      return NextResponse.json({ 
        success: false, 
        reply: "I apologize, but I could not generate a response right now. Please try again or use the Client Portal to request a consultation." 
      });
    }

    // Sanitize any accidental self-introductions or repeated welcome phrases
    responseText = responseText
      .replace(/^(hello|hi|greetings|welcome)[^.\n]*?(advocate aastha|nyaya aastha|ai legal assistant)[^.\n]*?[\.\!\?]\s*/gi, '')
      .replace(/^as advocate aastha's ai legal assistant,?\s*/gi, '')
      .replace(/^welcome to (the )?nyaya aastha( digital)? portal\.?\s*/gi, '')
      .trim();

    return NextResponse.json({ success: true, reply: responseText });
  } catch (error: any) {
    console.error('[Gemini API Server Error]:', error);
    return NextResponse.json({ 
      success: false, 
      reply: "An unexpected error occurred. Please try again or submit your query via the Client Portal." 
    }, { status: 500 });
  }
}
