import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const amount = Math.floor(Math.random() * 2000) + 200;
  await prisma.entry.create({ data: { userId: user.id, type: 'MPESA_SIM', amount, paymentMethod: 'mpesa', note: 'Simulated M-Pesa transaction' } });
  await prisma.wallet.update({ where: { userId: user.id }, data: { mpesa: { increment: amount } } });

  return Response.json({ ok: true, amount });
}
