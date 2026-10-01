import { NextResponse } from 'next/server';
import { clearClientSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearClientSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Client logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout client session.' },
      { status: 500 }
    );
  }
}
