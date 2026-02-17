import { cookies } from 'next/headers';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'bc_session';

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  await prisma.session.create({ data: { token, userId, expiresAt } });
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', expires: expiresAt });
}

export async function clearSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().set(COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}
