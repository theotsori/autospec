import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const amount = Number(body.amount || 0);
  if (amount <= 0) return Response.json({ error: 'Amount required' }, { status: 400 });

  await prisma.entry.create({
    data: {
      userId: user.id,
      type: 'SALE',
      amount,
      paymentMethod: body.paymentMethod || 'cash',
      productId: body.productId || null,
      quantity: body.quantity ? Number(body.quantity) : null
    }
  });

  if (body.paymentMethod === 'mpesa') {
    await prisma.wallet.update({ where: { userId: user.id }, data: { mpesa: { increment: amount } } });
  } else {
    await prisma.wallet.update({ where: { userId: user.id }, data: { cash: { increment: amount } } });
  }

  return Response.json({ ok: true });
}
