import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42STVrTWNwWGY5RTU2aG14OWN4U2RzQWEyOGZpc1pSckJrcUVTLXcyMzcyc3c=';
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

    const systemInstruction = `You are the ClientFlow AI Assistant on the ClientFlow business & consultation portal.

CORE ROLE & DIRECTIVES:

1. SCOPE & DOMAIN:
- You help visitors and clients learn about business consultation services, strategic advisory, financial planning, technology & digital solutions, operational efficiency, regulatory compliance, and appointment scheduling.
- You guide users on how to book a consultation or access the Client Portal for existing project/case tracking and document uploads.
- If asked about wildly off-topic topics (such as hacking, malware, medical prescriptions, casual flirtatious queries), politely steer the user back:
  "I am your ClientFlow Assistant. I am specialized in business services, consultation booking, and client portal guidance. How can I assist you with your business needs today?"

2. ABSOLUTE FACTUALITY & ACCURACY:
- Provide helpful, professional, and accurate business and procedural insights.
- For legal, regulatory, or tax advice, clarify that the guidance is informational and recommend formal consultation scheduling for tailored review.

3. SHORT, CRISP & CONCISE RESPONSES:
- Keep every response SHORT, CRISP, AND CONCISE (maximum 2 short paragraphs or 3-4 bullet points, under 120 words total).
- Avoid fluff, repetition, or preamble.

4. NO REPETITIVE INTRODUCTIONS:
- Jump STRAIGHT into the answer on the very first word! Never begin with "Hello, I am..." or "Welcome to ClientFlow...".

5. ACTIONABLE NEXT STEP:
- Conclude with a helpful suggestion to book a consultation or check status in the Client Portal.`;

    const FAST_MODELS = [
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
        const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
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
        reply: `I apologize, but I could not generate a response right now (${lastError || 'No model response'}). Please try again or use the Client Portal to request a consultation.` 
      });
    }

    // Sanitize any accidental self-introductions or repeated welcome phrases
    responseText = responseText
      .replace(/^(hello|hi|greetings|welcome)[^.\n]*?(clientflow|ai assistant|consultant)[^.\n]*?[\.\!\?]\s*/gi, '')
      .replace(/^as (your |the )?(clientflow |ai )?assistant,?\s*/gi, '')
      .replace(/^welcome to (the )?clientflow( digital)? portal\.?\s*/gi, '')
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
