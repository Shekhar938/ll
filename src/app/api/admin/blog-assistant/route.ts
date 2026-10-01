import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import {
  validateBlogCopilotInput,
  sanitizeBlogCopilotOutput,
  BLOG_COPILOT_SYSTEM_PROMPT,
} from '@/lib/blogCopilotGuardrails';

export async function POST(req: Request) {
  try {
    const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42STVrTWNwWGY5RTU2aG14OWN4U2RzQWEyOGZpc1pSckJrcUVTLXcyMzcyc3c=';
    const fallbackKey = typeof Buffer !== 'undefined' ? Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf-8') : '';
    const apiKey = process.env.GEMINI_API_KEY || process.env.DATA_GEMINI_API_KEY || fallbackKey;

    const { action, articleContext, messages, prompt } = await req.json();

    // Independent Input Guardrail Check
    const inputGuard = validateBlogCopilotInput(prompt, messages);
    if (!inputGuard.passed) {
      return NextResponse.json({
        success: true,
        reply: inputGuard.guardrailResponse,
        guardrailTriggered: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = BLOG_COPILOT_SYSTEM_PROMPT;

    const contextSummary = articleContext ? `
CURRENT ARTICLE DRAFT CONTEXT:
- Title: ${articleContext.title || 'Untitled'}
- Author: ${articleContext.author || 'Advocate Aastha'}
- Tags: ${articleContext.tags || 'None'}
- Summary: ${articleContext.excerpt || 'None'}
- Content Snippet: ${articleContext.content ? articleContext.content.slice(0, 3000) : 'None'}
` : '';

    let userInstruction = prompt || '';
    if (action === 'review') {
      userInstruction = `Please conduct a comprehensive legal review of this article draft. Check for legal accuracy (especially BNS 2023/BNSS/BSA alignment), structural clarity, flow, and suggest 3 concrete enhancements.`;
    } else if (action === 'enhance') {
      userInstruction = `Please suggest 3 headline improvements, structural sub-headings, and statutory citations to elevate this article to publication quality.`;
    } else if (action === 'summary') {
      userInstruction = `Generate a compelling 2-sentence executive summary/excerpt and 5 relevant category tags for this article.`;
    } else if (action === 'simplify') {
      userInstruction = `Rewrite the key legal concepts in this article so they are easily understandable by common citizens while retaining strict legal accuracy.`;
    } else if (action === 'plagiarism' || action === 'audit-originality') {
      userInstruction = `Please perform a comprehensive AI Content Generation & Plagiarism Audit on this article draft. Provide:
1. Estimated Originality Index (0-100%) and AI Content Probability.
2. Detection Breakdown (flag overused AI cliché words like 'delve', 'testament', 'tapestry', or uniform sentence length).
3. Attribution & Citation Risk (check for unreferenced statutory clauses or generic legal descriptions).
4. Concrete Rewrites: Provide 2 specific sentence rewrites to maximize human authenticity and Advocate Aastha's legal voice.`;
    }

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (contextSummary) {
      contents.push({ role: 'user', parts: [{ text: contextSummary }] });
      contents.push({ role: 'model', parts: [{ text: 'I have analyzed your article draft context. How can I assist you with editing or refining it?' }] });
    }

    if (messages && Array.isArray(messages)) {
      for (const m of messages) {
        if (!m.content || typeof m.content !== 'string') continue;
        const role = m.role === 'user' ? 'user' : 'model';
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += '\n\n' + m.content;
        } else {
          contents.push({ role, parts: [{ text: m.content }] });
        }
      }
    }

    if (userInstruction) {
      contents.push({ role: 'user', parts: [{ text: userInstruction }] });
    }

    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents as any,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 1200,
          },
        });

        if (response && response.text) {
          const sanitizedReply = sanitizeBlogCopilotOutput(response.text);
          const isGuardrail = sanitizedReply.includes('🛡️') || sanitizedReply.toLowerCase().includes('guardrail');
          return NextResponse.json({ success: true, reply: sanitizedReply, isGuardrail, modelUsed: modelName });
        }
      } catch (err: any) {
        console.warn(`Gemini SDK model ${modelName} failed in blog-assistant:`, err.message);
        lastError = err;
      }
    }

    // Direct REST API Fallback
    try {
      const restRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents.map(c => ({
            role: c.role,
            parts: c.parts.map(p => ({ text: p.text }))
          })),
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
        })
      });
      const restData = await restRes.json();
      if (restData.candidates && restData.candidates[0]?.content?.parts[0]?.text) {
        const sanitizedReply = sanitizeBlogCopilotOutput(restData.candidates[0].content.parts[0].text);
        const isGuardrail = sanitizedReply.includes('🛡️') || sanitizedReply.toLowerCase().includes('guardrail');
        return NextResponse.json({
          success: true,
          reply: sanitizedReply,
          isGuardrail,
          modelUsed: 'gemini-3.5-flash-lite-rest'
        });
      }
    } catch (restErr) {
      console.error('REST API fallback failed in blog-assistant:', restErr);
    }

    return NextResponse.json({
      success: false,
      reply: 'Failed to generate AI legal writing assistance. Please verify your connection.',
      error: lastError?.message
    }, { status: 500 });

  } catch (error: any) {
    console.error('Error in blog-assistant API route:', error);
    return NextResponse.json({ success: false, reply: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}
