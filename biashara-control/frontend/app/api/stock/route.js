import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const quantity = Number(body.quantity || 0);
  const buyingPrice = Number(body.buyingPrice || 0);
  if (!body.name || quantity <= 0 || buyingPrice < 0) return Response.json({ error: 'Invalid stock payload' }, { status: 400 });

  const existing = await prisma.product.findFirst({ where: { userId: user.id, name: body.name } });
  if (existing) {
    const totalQty = existing.quantity + quantity;
    const newUnitCost = (existing.unitCost * existing.quantity + buyingPrice * quantity) / totalQty;
    await prisma.product.update({ where: { id: existing.id }, data: { quantity: totalQty, unitCost: newUnitCost } });
  } else {
    await prisma.product.create({ data: { userId: user.id, name: body.name, quantity, unitCost: buyingPrice } });
  }

  const totalCost = quantity * buyingPrice;
  await prisma.entry.create({ data: { userId: user.id, type: 'STOCK_PURCHASE', amount: totalCost, paymentMethod: 'cash', note: body.name } });
  await prisma.wallet.update({ where: { userId: user.id }, data: { cash: { decrement: totalCost } } });

  return Response.json({ ok: true });
}
