export type DailyInputs = {
  salesKes: number;
  expensesKes: number;
  stockBoughtKes: number;
  yesterdayProfitKes: number;
  trailing7DayProfitKes: number[];
  trailing30DaySalesKes: number;
  taxRate: number;
  vatThresholdKes: number;
  vatWarningRatio: number;
};

export const calcDailyProfit = (i: DailyInputs) => i.salesKes - i.expensesKes - i.stockBoughtKes;

export const calcGrowthVsYesterdayPct = (todayProfitKes: number, yesterdayProfitKes: number) => {
  if (yesterdayProfitKes === 0) return todayProfitKes > 0 ? 100 : 0;
  return ((todayProfitKes - yesterdayProfitKes) / Math.abs(yesterdayProfitKes)) * 100;
};

export const calcWeeklyProfit = (dailyProfitSeriesKes: number[]) => dailyProfitSeriesKes.slice(-7).reduce((a, b) => a + b, 0);

export const calcMonthlyProfit = (dailyProfitSeriesKes: number[]) => dailyProfitSeriesKes.slice(-30).reduce((a, b) => a + b, 0);

export const calcBurnRate = (trailing7DayProfitKes: number[]) => {
  const avg = trailing7DayProfitKes.slice(-7).reduce((a, b) => a + b, 0) / Math.max(1, trailing7DayProfitKes.slice(-7).length);
  return avg < 0 ? Math.abs(avg) : 0;
};

export const calcTaxSetAside = (profitKes: number, taxRate: number) => Math.max(0, profitKes * taxRate);

export const calcMonthlyTaxEstimate = (monthToDateProfitKes: number, taxRate: number) => Math.max(0, monthToDateProfitKes * taxRate);

export const isVatWarning = (trailing30DaySalesKes: number, vatThresholdKes: number, vatWarningRatio: number) => {
  const annualized = trailing30DaySalesKes * 12;
  return annualized >= vatThresholdKes * vatWarningRatio;
};

export const explainProfit = (profitKes: number, burnRateKes: number) => {
  if (profitKes > 0) return `You made KES ${profitKes.toFixed(0)} today.`;
  if (profitKes < 0) return `You are losing KES ${Math.abs(profitKes).toFixed(0)} per day.`;
  if (burnRateKes > 0) return `You are burning KES ${burnRateKes.toFixed(0)} per day.`;
  return 'You broke even today.';
};
