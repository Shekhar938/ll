import { NextResponse } from 'next/server';
import { checkAdminPassword, setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!checkAdminPassword(password)) {
      // Small delay to prevent brute force
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
