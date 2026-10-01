import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Rock-solid production models prioritized by current stability and SLA
const PRODUCTION_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash'
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.DATA_GEMINI_API_KEY;
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, reply: 'Invalid request format. Messages array is required.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ 
        success: false,
        reply: "The AI Legal Assistant requires a valid GEMINI_API_KEY. Please configure GEMINI_API_KEY in your environment settings." 
      });
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

Your Purpose:
1. Provide clear, accurate, and reassuring legal information regarding Indian Law (including BNS 2023, DPDP Act 2023, RERA, Criminal Law, Civil Law, Family Law, Property Disputes, Labour Codes, and Cyber Crime).
2. Assist users in navigating their legal concerns and guide them to use the "Client Portal" / "Request Consultation" feature on the site to upload case documents or schedule a formal consultation.

Important Compliance Rules:
- Include a brief statement when appropriate that responses are for informational guidance in compliance with Bar Council of India rules and do not substitute formal legal representation.
- Keep responses well-structured, clear, professional, and accessible.`;

    let responseText = '';
    let lastErrorMessage = '';

    // Attempt generation across stable production models with retry logic
    for (const modelName of PRODUCTION_MODELS) {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        try {
          const res = await ai.models.generateContent({
            model: modelName,
            contents,
            config: { systemInstruction }
          });

          if (res && res.text) {
            responseText = res.text;
            break;
          }
        } catch (err: any) {
          lastErrorMessage = err?.message || String(err);
          console.warn(`[Gemini API] Attempt ${attempts + 1} on model ${modelName} failed:`, lastErrorMessage);
          attempts++;
          if (attempts < maxAttempts) {
            // Short backoff before retry
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }

      if (responseText) break;
    }

    if (!responseText) {
      console.error('[Gemini API Error] All models failed. Last error:', lastErrorMessage);
      return NextResponse.json({ 
        success: false, 
        reply: "I am currently experiencing a high volume of requests. Please try asking again in a moment, or use the Client Portal to request a formal consultation." 
      });
    }

    return NextResponse.json({ success: true, reply: responseText });
  } catch (error: any) {
    console.error('[Gemini API Server Exception]:', error);
    return NextResponse.json({ 
      success: false, 
      reply: "An unexpected error occurred. Please try again or submit your query via the Client Portal." 
    }, { status: 500 });
  }
}
