export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function computeStockValue(products) {
  return products.reduce((sum, p) => sum + p.unitCost * p.quantity, 0);
}

export function computeAverageCost(products, productId) {
  const p = products.find((it) => it.id === productId);
  return p ? p.unitCost : 0;
}

export function computeTodayMetrics(entries, products) {
  let sales = 0;
  let expenses = 0;
  let cogs = 0;

  for (const entry of entries) {
    if (entry.type === 'SALE' || entry.type === 'MPESA_SIM') {
      sales += entry.amount;
      if (entry.productId && entry.quantity) {
        cogs += computeAverageCost(products, entry.productId) * entry.quantity;
      }
    }
    if (entry.type === 'EXPENSE') expenses += entry.amount;
  }

  return {
    sales,
    expenses,
    cogs,
    profit: sales - expenses - cogs
  };
}
