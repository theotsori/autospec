import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const amount = Number(body.amount || 0);
  if (!body.person || amount <= 0) return Response.json({ error: 'Invalid debt payload' }, { status: 400 });

  await prisma.debt.create({
    data: {
      userId: user.id,
      person: body.person,
      amount,
      direction: body.direction === 'I_OWE' ? 'I_OWE' : 'OWED_TO_ME'
    }
  });

  return Response.json({ ok: true });
}
