import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42STVrTWNwWGY5RTU2aG14OXN4U2RzQWEyOGZpc1pSckJrcUVTLXcyMzcyc3c=';
    const fallbackKey = typeof Buffer !== 'undefined' ? Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf-8') : '';
    const apiKey = process.env.GEMINI_API_KEY || process.env.DATA_GEMINI_API_KEY || fallbackKey;

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

STRICT GUARDRAILS & CORE DIRECTIVES:

1. SCOPE GUARDRAILS (STRICT LEGAL DOMAIN ONLY):
- You MUST answer ONLY questions related to Indian Law, legal rights, statutory procedures, acts/statutes (BNS 2023, BNSS 2023, BSA 2023, DPDP Act 2023, RERA, Property, Family, Civil, Criminal, Labour, Cyber Law), and consultation booking with Advocate Aastha.
- If the user asks about ANY off-topic subject (such as coding, recipes, math, trivia, entertainment, sports, general non-legal chat, etc.), politely decline immediately:
  "I am Advocate Aastha's AI Legal Assistant. I am specialized strictly in Indian law, legal queries, and booking consultations. How can I assist you with your legal matters?"

2. ABSOLUTE FACTUALITY & ANTI-HALLUCINATION:
- State ONLY verified facts of Indian legislation, statutes, and legal procedures.
- NEVER invent or hallucinate section numbers, act titles, case laws, judgments, or fake citations.
- If uncertain about a specific statutory section or case detail, state the general legal position accurately without guessing numbers, and recommend booking a consultation for document verification.

3. SHORT, CRISP & CONCISE RESPONSES:
- Keep every response SHORT, CRISP, AND CONCISE (maximum 2 short paragraphs or 3-4 bullet points, under 120 words total).
- Avoid fluff, repetitive explanations, preamble, or lengthy lectures.

4. NO REPETITIVE INTRODUCTIONS:
- NEVER introduce yourself or say "Hello! I am Advocate Aastha's AI..." or "Welcome to Nyaya Aastha...". Jump STRAIGHT into the answer on the very first word!

5. ACTIONABLE NEXT STEP & BCI DISCLAIMER:
- End with a short follow-up question or invitation to upload case documents via the Client Portal.
- Include a short 1-line BCI disclaimer at the end.`;

    const FAST_MODELS = [
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash'
    ];
    let responseText = '';
    let lastError = '';

    for (const modelName of FAST_MODELS) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            maxOutputTokens: 400,
            temperature: 0.2
          }
        });

        if (res && res.text) {
          responseText = res.text;
          break;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn(`[Gemini API SDK] ${modelName} attempt failed:`, lastError);
      }
    }

    // Direct REST API Fallback if SDK calls fail
    if (!responseText && apiKey) {
      try {
        const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const restRes = await fetch(restUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { maxOutputTokens: 400, temperature: 0.2 }
          })
        });
        const restData = await restRes.json();
        if (restData?.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = restData.candidates[0].content.parts[0].text;
        } else if (restData?.error?.message) {
          lastError = restData.error.message;
        }
      } catch (restErr: any) {
        lastError = restErr?.message || String(restErr);
      }
    }

    if (!responseText) {
      return NextResponse.json({ 
        success: false, 
        reply: `I apologize, but I could not generate a response right now. Please try again or use the Client Portal to request a consultation.` 
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
