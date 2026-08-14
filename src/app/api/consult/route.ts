import { NextResponse } from 'next/server';
import { getFilteredConsultations, getAllConsultations, saveConsultation, initializeDatabase } from '@/lib/store';
import { generateId, sanitizeInput } from '@/lib/server-utils';
import { generateAISummaryLive } from '@/lib/ai';
import { ConsultationRequest } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.mobile || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(body.mobile.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const consultation: ConsultationRequest = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      fullName: sanitizeInput(body.fullName || ''),
      mobile: sanitizeInput(body.mobile || ''),
      email: sanitizeInput(body.email || ''),
      city: sanitizeInput(body.city || ''),
      state: sanitizeInput(body.state || ''),
      preferredLanguage: sanitizeInput(body.preferredLanguage || ''),
      occupation: sanitizeInput(body.occupation || ''),
      practiceArea: sanitizeInput(body.practiceArea || ''),
      caseType: sanitizeInput(body.caseType || ''),
      caseSummary: sanitizeInput((body.caseSummary || '').substring(0, 1000)),
      opponentName: sanitizeInput(body.opponentName || ''),
      court: sanitizeInput(body.court || ''),
      policeStation: sanitizeInput(body.policeStation || ''),
      caseStage: sanitizeInput(body.caseStage || ''),
      urgency: body.urgency || 'medium',
      preferredContactTime: body.preferredContactTime || 'morning',
      videoConsultation: Boolean(body.videoConsultation),
      documents: body.documents || [],
    };

    // Generate Live Gemini AI analysis
    const ai = await generateAISummaryLive(consultation);
    consultation.aiSummary = ai.summary;
    consultation.aiCategory = ai.category;
    consultation.aiPriority = ai.priority;
    consultation.aiDocuments = ai.documents;
    consultation.aiDuration = ai.duration;
    consultation.aiRiskLevel = ai.riskLevel;
    consultation.aiKeywords = ai.keywords;
    consultation.aiNextSteps = ai.nextSteps;

    await initializeDatabase();
    await saveConsultation(consultation);

    return NextResponse.json({
      success: true,
      id: consultation.id,
      message: 'Consultation request submitted successfully',
    });
  } catch (error: any) {
    console.error('Error saving consultation:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { isAdminAuthenticated } = await import('@/lib/auth');
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const practiceArea = url.searchParams.get('practiceArea') || undefined;
    const state = url.searchParams.get('state') || undefined;

    await initializeDatabase();
    
    const { rows: consultations } = await getFilteredConsultations({
      search,
      status,
      practiceArea,
      state,
    });

    const all = await getAllConsultations();
    const today = new Date().toDateString();
    const stats = {
      total: all.length,
      todayCount: all.filter(
        (c) => new Date(c.createdAt).toDateString() === today
      ).length,
      pending: all.filter((c) => c.status === 'pending').length,
      resolved: all.filter((c) => c.status === 'resolved').length,
    };

    return NextResponse.json({ consultations, stats });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

