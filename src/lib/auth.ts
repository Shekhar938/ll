import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nyaya2024';

const SESSION_COOKIE = 'nyaya_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'nyaya-secret-key-change-in-production';

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const payload = Buffer.from(
    JSON.stringify({ authenticated: true, expiresAt: expires.toISOString() })
  ).toString('base64');
  cookieStore.set(SESSION_COOKIE, `${payload}.${SESSION_SECRET.slice(0, 8)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires,
    path: '/',
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return false;
  try {
    const [payload, sig] = cookie.value.split('.');
    if (sig !== SESSION_SECRET.slice(0, 8)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    if (!data.authenticated) return false;
    if (new Date(data.expiresAt) < new Date()) return false;
    return true;
  } catch {
    return false;
  }
}

const CLIENT_SESSION_COOKIE = 'nyaya_client_session';

export async function setClientSession(caseId: string, mobile: string): Promise<void> {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const payload = Buffer.from(
    JSON.stringify({ authenticated: true, caseId, mobile, expiresAt: expires.toISOString() })
  ).toString('base64');
  cookieStore.set(CLIENT_SESSION_COOKIE, `${payload}.${SESSION_SECRET.slice(0, 8)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires,
    path: '/',
  });
}

export async function clearClientSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_SESSION_COOKIE);
}

export async function getClientSession(): Promise<{ authenticated: boolean; caseId: string; mobile: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CLIENT_SESSION_COOKIE);
  if (!cookie?.value) return null;
  try {
    const [payload, sig] = cookie.value.split('.');
    if (sig !== SESSION_SECRET.slice(0, 8)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    if (!data.authenticated) return null;
    if (new Date(data.expiresAt) < new Date()) return null;
    return { authenticated: true, caseId: data.caseId, mobile: data.mobile };
  } catch {
    return null;
  }
}
