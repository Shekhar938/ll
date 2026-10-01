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

Your Purpose:
1. Provide clear, concise, and helpful legal information regarding Indian Law (BNS 2023, DPDP Act 2023, RERA, Criminal, Civil, Family, Property, Labour, Cyber Crime).
2. Guide users to use the "Client Portal" / "Request Consultation" feature on the site to upload case documents or schedule a formal consultation.
3. Keep responses structured, professional, and readable (use short bullet points or 2-3 short paragraphs). Include a short BCI disclaimer statement when appropriate.`;

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

    return NextResponse.json({ success: true, reply: responseText });
  } catch (error: any) {
    console.error('[Gemini API Server Error]:', error);
    return NextResponse.json({ 
      success: false, 
      reply: "An unexpected error occurred. Please try again or submit your query via the Client Portal." 
    }, { status: 500 });
  }
}
