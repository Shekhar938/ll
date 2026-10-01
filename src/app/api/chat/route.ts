import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.DATA_GEMINI_API_KEY;
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "The AI Legal Assistant requires a GEMINI_API_KEY environment variable. Please configure GEMINI_API_KEY in your project settings." 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Ensure conversation starts with 'user' and alternates roles
    const userFirstIndex = messages.findIndex((m: any) => m.role === 'user');
    const validMessages = userFirstIndex >= 0 ? messages.slice(userFirstIndex) : messages;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const m of validMessages) {
      const role = m.role === 'user' ? 'user' : 'model';
      if (!m.content || typeof m.content !== 'string') continue;
      
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        // Append to last message if role is duplicated
        contents[contents.length - 1].parts[0].text += '\n\n' + m.content;
      } else {
        contents.push({ role, parts: [{ text: m.content }] });
      }
    }

    // Fallback if contents is empty
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

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];
    let responseText = '';
    let lastError = '';

    for (const modelName of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents,
          config: { systemInstruction }
        });
        if (res.text) {
          responseText = res.text;
          break;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn(`Model ${modelName} failed:`, lastError);
      }
    }

    if (!responseText) {
      console.error('All Gemini models failed. Last error:', lastError);
      responseText = "I apologize, but I could not generate a response. Please try asking again or submit your case details through the Client Portal.";
    }

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Gemini API Chat Error:', error);
    return NextResponse.json({ 
      reply: "I am experiencing a temporary connection issue. You can submit your case query directly through the Client Portal or try again shortly." 
    }, { status: 500 });
  }
}
