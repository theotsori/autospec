export type ComponentSpec = {
  name: string;
  purpose: string;
  props: string[];
  touchTarget: 'lg' | 'xl';
};

export const mobileComponents: ComponentSpec[] = [
  { name: 'ProfitHeroCard', purpose: 'Show Today Profit big number + plain insight sentence', props: ['todayProfitKes', 'growthVsYesterdayPct', 'safetyColor', 'insight'], touchTarget: 'xl' },
  { name: 'WalletBalancesCard', purpose: 'Show cash in hand and mpesa balance', props: ['cashKes', 'mpesaKes'], touchTarget: 'lg' },
  { name: 'BusinessHealthStrip', purpose: 'Show stock value, owed to me, i owe', props: ['stockValueKes', 'owedToMeKes', 'iOweKes'], touchTarget: 'lg' },
  { name: 'QuickActionButtonXL', purpose: 'Primary 1-tap actions', props: ['label', 'icon', 'onPress'], touchTarget: 'xl' },
  { name: 'QuickAddBottomSheet', purpose: '3-tap manual entry flow', props: ['entryType', 'defaultChannel', 'onSubmit'], touchTarget: 'xl' },
  { name: 'MpesaSyncStatusChip', purpose: 'Connection and sync freshness indicator', props: ['isConnected', 'lastSyncAt'], touchTarget: 'lg' },
  { name: 'InventoryItemCard', purpose: 'Item name, quantity, value, fast/dead stock label', props: ['name', 'quantity', 'unitCostKes', 'status'], touchTarget: 'lg' },
  { name: 'DeadStockAlertCard', purpose: 'Warn no movement inventory', props: ['itemName', 'daysWithoutMovement'], touchTarget: 'lg' },
  { name: 'DebtReminderCard', purpose: 'Overdue debt with risk badge and CTA', props: ['counterparty', 'balanceKes', 'daysOverdue', 'riskLevel'], touchTarget: 'xl' },
  { name: 'TaxSetAsideCard', purpose: 'Daily tax amount to reserve', props: ['dailyTaxKes', 'monthlyEstimateKes'], touchTarget: 'lg' },
  { name: 'VatThresholdWarningCard', purpose: 'Warn VAT threshold approach', props: ['thresholdKes', 'annualizedSalesKes', 'warningRatio'], touchTarget: 'lg' },
  { name: 'SubscriptionTrialBanner', purpose: 'Trial left / unpaid warning', props: ['status', 'daysRemaining', 'planPriceKes'], touchTarget: 'xl' },
  { name: 'LockedStateOverlay', purpose: 'Read-only lock state and pay CTA', props: ['lockReason', 'payNowAction'], touchTarget: 'xl' },
  { name: 'OfflineSyncIndicator', purpose: 'Pending offline actions count', props: ['pendingCount', 'lastSyncedAt'], touchTarget: 'lg' }
];
export const mobileComponents = [
  'TopStatusBarCard',
  'ProfitHeroCard',
  'GrowthPill',
  'WalletBalanceCard',
  'KpiDangerCard',
  'QuickActionButtonXL',
  'QuickAddBottomSheet',
  'MpesaSyncStatusChip',
  'InsightTextBanner',
  'DebtRiskBadge',
  'DebtReminderCard',
  'InventoryItemCard',
  'DeadStockAlertCard',
  'TaxSetAsideCard',
  'VatThresholdWarningCard',
  'SubscriptionTrialBanner',
  'LockedStateOverlay',
  'OfflineSyncIndicator',
  'SkeletonCard',
  'ConfirmActionSheet'
] as const;
