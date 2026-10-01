import { NextResponse } from 'next/server';
import { getClientSession } from '@/lib/auth';
import { getConsultationById } from '@/lib/store';

export async function GET() {
  try {
    const session = await getClientSession();

    if (!session || !session.caseId) {
      return NextResponse.json(
        { authenticated: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const consultation = await getConsultationById(session.caseId);

    if (!consultation) {
      return NextResponse.json(
        { authenticated: false, error: 'Case data not found' },
        { status: 444 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      case: consultation,
    });
  } catch (error) {
    console.error('Fetch client me error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client case session details.' },
      { status: 500 }
    );
  }
}
