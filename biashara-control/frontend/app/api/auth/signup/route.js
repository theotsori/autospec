import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  if (!body.email || !body.password) return Response.json({ error: 'Email and password required' }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) return Response.json({ error: 'Account exists' }, { status: 400 });

  const user = await prisma.user.create({
    data: {
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, 10)
    }
  });

  await prisma.wallet.create({ data: { userId: user.id, cash: 0, mpesa: 0 } });
  await createSession(user.id);
  return Response.json({ ok: true });
}
