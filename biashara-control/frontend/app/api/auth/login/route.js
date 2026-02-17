import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  await createSession(user.id);
  return Response.json({ ok: true });
}
