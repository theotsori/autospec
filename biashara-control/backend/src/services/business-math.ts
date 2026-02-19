export type DailyInputs = {
  salesKes: number;
  expensesKes: number;
  stockBoughtKes: number;
  yesterdayProfitKes: number;
  trailing7DayProfitKes: number[];
  trailing30DaySalesKes: number;
  monthToDateProfitKes: number;
  taxRate: number;
  vatThresholdKes: number;
  vatWarningRatio: number;
};

export type ProfitOutput = {
  dailyProfitKes: number;
  weeklyProfitKes: number;
  monthlyProfitKes: number;
  burnRateKes: number;
  growthVsYesterdayPct: number;
  dailyTaxSetAsideKes: number;
  monthlyTaxEstimateKes: number;
  vatWarning: boolean;
  explanation: string;
};

export const calcDailyProfit = (i: DailyInputs) => i.salesKes - i.expensesKes - i.stockBoughtKes;
export const calcWeeklyProfit = (series: number[]) => series.slice(-7).reduce((a, b) => a + b, 0);
export const calcMonthlyProfit = (series: number[]) => series.slice(-30).reduce((a, b) => a + b, 0);

export const calcGrowthVsYesterdayPct = (todayProfitKes: number, yesterdayProfitKes: number) => {
  if (yesterdayProfitKes === 0) return todayProfitKes > 0 ? 100 : 0;
  return ((todayProfitKes - yesterdayProfitKes) / Math.abs(yesterdayProfitKes)) * 100;
};

export const calcBurnRate = (trailing7DayProfitKes: number[]) => {
  const lookback = trailing7DayProfitKes.slice(-7);
  const avg = lookback.reduce((a, b) => a + b, 0) / Math.max(1, lookback.length);
  return avg < 0 ? Math.abs(avg) : 0;
};

export const calcTaxSetAside = (profitKes: number, taxRate: number) => Math.max(0, profitKes * taxRate);
export const calcMonthlyTaxEstimate = (monthToDateProfitKes: number, taxRate: number) => Math.max(0, monthToDateProfitKes * taxRate);

export const isVatWarning = (trailing30DaySalesKes: number, vatThresholdKes: number, vatWarningRatio: number) => {
  const annualizedSalesKes = trailing30DaySalesKes * 12;
  return annualizedSalesKes >= vatThresholdKes * vatWarningRatio;
};

export const explainProfit = (dailyProfitKes: number, burnRateKes: number, dailyTaxSetAsideKes: number) => {
  if (dailyProfitKes > 0) return `You made KES ${dailyProfitKes.toFixed(0)} today. Set aside KES ${dailyTaxSetAsideKes.toFixed(0)} for tax.`;
  if (dailyProfitKes < 0) return `You are losing KES ${Math.abs(dailyProfitKes).toFixed(0)} per day.`;
  if (burnRateKes > 0) return `You are burning KES ${burnRateKes.toFixed(0)} per day.`;
  return 'You broke even today.';
};

export const computeProfitOutput = (i: DailyInputs): ProfitOutput => {
  const dailyProfitKes = calcDailyProfit(i);
  const weeklyProfitKes = calcWeeklyProfit(i.trailing7DayProfitKes);
  const monthlyProfitKes = calcMonthlyProfit(i.trailing7DayProfitKes);
  const burnRateKes = calcBurnRate(i.trailing7DayProfitKes);
  const growthVsYesterdayPct = calcGrowthVsYesterdayPct(dailyProfitKes, i.yesterdayProfitKes);
  const dailyTaxSetAsideKes = calcTaxSetAside(dailyProfitKes, i.taxRate);
  const monthlyTaxEstimateKes = calcMonthlyTaxEstimate(i.monthToDateProfitKes, i.taxRate);
  const vatWarning = isVatWarning(i.trailing30DaySalesKes, i.vatThresholdKes, i.vatWarningRatio);

  return {
    dailyProfitKes,
    weeklyProfitKes,
    monthlyProfitKes,
    burnRateKes,
    growthVsYesterdayPct,
    dailyTaxSetAsideKes,
    monthlyTaxEstimateKes,
    vatWarning,
    explanation: explainProfit(dailyProfitKes, burnRateKes, dailyTaxSetAsideKes)
  };
};
