import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(_req, { params }) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const debt = await prisma.debt.findFirst({ where: { id: params.id, userId: user.id } });
  if (!debt) return Response.json({ error: 'Not found' }, { status: 404 });

  await prisma.debt.update({ where: { id: debt.id }, data: { status: 'PAID', paidAt: new Date() } });
  return Response.json({ ok: true });
}
