import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'nyaya_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'nyaya-secret-key-change-in-production';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/client')) {
    const cookie = request.cookies.get(SESSION_COOKIE);
    if (!cookie?.value) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const [payload, sig] = cookie.value.split('.');
      if (sig !== SESSION_SECRET.slice(0, 8)) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
      if (!data.authenticated || new Date(data.expiresAt) < new Date()) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/client/:path*'],
};
