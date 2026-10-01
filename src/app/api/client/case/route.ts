import { NextResponse } from 'next/server';
import { getClientSession } from '@/lib/auth';
import { getConsultationById, updateConsultation } from '@/lib/store';

export async function PATCH(request: Request) {
  try {
    const session = await getClientSession();

    if (!session || !session.caseId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to your Client Portal session.' },
        { status: 401 }
      );
    }

    const currentCase = await getConsultationById(session.caseId);
    if (!currentCase) {
      return NextResponse.json(
        { error: 'Case not found.' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Whitelist allowed fields client can update
    const allowedUpdates: Record<string, any> = {};

    if (typeof body.fullName === 'string' && body.fullName.trim()) allowedUpdates.fullName = body.fullName.trim();
    if (typeof body.email === 'string') allowedUpdates.email = body.email.trim();
    if (typeof body.mobile === 'string' && body.mobile.trim()) allowedUpdates.mobile = body.mobile.trim();
    if (typeof body.city === 'string') allowedUpdates.city = body.city.trim();
    if (typeof body.state === 'string') allowedUpdates.state = body.state.trim();
    if (typeof body.preferredLanguage === 'string') allowedUpdates.preferredLanguage = body.preferredLanguage.trim();
    if (typeof body.occupation === 'string') allowedUpdates.occupation = body.occupation.trim();
    if (typeof body.preferredContactTime === 'string') allowedUpdates.preferredContactTime = body.preferredContactTime;
    if (typeof body.videoConsultation === 'boolean') allowedUpdates.videoConsultation = body.videoConsultation;

    // Legal Matter Details
    if (typeof body.caseSummary === 'string') allowedUpdates.caseSummary = body.caseSummary;
    if (typeof body.opponentName === 'string') allowedUpdates.opponentName = body.opponentName;
    if (typeof body.court === 'string') allowedUpdates.court = body.court;
    if (typeof body.policeStation === 'string') allowedUpdates.policeStation = body.policeStation;
    if (typeof body.caseStage === 'string') allowedUpdates.caseStage = body.caseStage;
    if (typeof body.urgency === 'string') allowedUpdates.urgency = body.urgency;

    // Uploaded Documents
    if (Array.isArray(body.documents)) {
      allowedUpdates.documents = body.documents;
    }

    const updatedCase = await updateConsultation(session.caseId, allowedUpdates);

    return NextResponse.json({
      success: true,
      case: updatedCase,
    });
  } catch (error) {
    console.error('Client case update error:', error);
    return NextResponse.json(
      { error: 'Failed to update case details.' },
      { status: 500 }
    );
  }
}
