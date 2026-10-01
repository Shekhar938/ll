import { NextResponse } from 'next/server';
import { getConsultationByCredentials } from '@/lib/store';
import { setClientSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { caseId, identifier } = await request.json();

    if (!caseId || !identifier) {
      return NextResponse.json(
        { error: 'Case Reference ID and Mobile/Email are required.' },
        { status: 400 }
      );
    }

    const consultation = await getConsultationByCredentials(caseId, identifier);

    if (!consultation) {
      return NextResponse.json(
        { error: 'No matching case found. Please check your Case Reference ID and registered Mobile/Email.' },
        { status: 401 }
      );
    }

    await setClientSession(consultation.id, consultation.mobile);

    return NextResponse.json({
      success: true,
      case: consultation,
    });
  } catch (error) {
    console.error('Client login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during client login.' },
      { status: 500 }
    );
  }
}
