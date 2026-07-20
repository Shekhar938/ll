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
