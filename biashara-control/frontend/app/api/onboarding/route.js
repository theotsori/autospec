import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();

  await prisma.user.update({
    where: { id: user.id },
    data: { businessName: body.businessName, businessType: body.businessType }
  });
  await prisma.wallet.update({ where: { userId: user.id }, data: { cash: Number(body.startingCash || 0), mpesa: Number(body.mpesaFloat || 0) } });

  for (const p of body.products || []) {
    await prisma.product.create({ data: { userId: user.id, name: p.name, unitCost: Number(p.unitCost || 0), quantity: Number(p.quantity || 0) } });
  }

  return Response.json({ ok: true });
}
