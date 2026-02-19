import { prisma } from '@/lib/prisma';
import { computeStockValue, computeTodayMetrics, startOfDay } from '@/lib/calc';

export async function getDashboardData(userId) {
  const dayStart = startOfDay();
  const [wallet, products, debts, entries] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.product.findMany({ where: { userId } }),
    prisma.debt.findMany({ where: { userId } }),
    prisma.entry.findMany({ where: { userId, happenedAt: { gte: dayStart } }, orderBy: { happenedAt: 'desc' }, take: 20 })
  ]);

  const metrics = computeTodayMetrics(entries, products);
  const owedToMe = debts.filter((d) => d.direction === 'OWED_TO_ME' && d.status === 'OPEN').reduce((s, d) => s + d.amount, 0);
  const iOwe = debts.filter((d) => d.direction === 'I_OWE' && d.status === 'OPEN').reduce((s, d) => s + d.amount, 0);

  return {
    metrics,
    balances: {
      cash: wallet?.cash || 0,
      mpesa: wallet?.mpesa || 0,
      owedToMe,
      iOwe,
      stockValue: computeStockValue(products)
    },
    entries,
    debts,
    products
  };
}
