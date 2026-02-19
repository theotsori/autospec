export type AppRouteConfig = {
  path: string;
  title: string;
  requiresSubscriptionWriteAccess: boolean;
  bottomNav: boolean;
  primaryActions: string[];
};

export const appRoutes: AppRouteConfig[] = [
  { path: '/login', title: 'Welcome Back', requiresSubscriptionWriteAccess: false, bottomNav: false, primaryActions: ['Enter phone', 'Enter PIN', 'Login'] },
  { path: '/onboarding', title: 'Set Up Business', requiresSubscriptionWriteAccess: true, bottomNav: false, primaryActions: ['Business name', 'Business type', 'Start trial'] },
  { path: '/home', title: 'Today Overview', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['Add sale', 'Add expense', 'Add stock bought'] },
  { path: '/quick-add', title: 'Quick Add', requiresSubscriptionWriteAccess: true, bottomNav: false, primaryActions: ['Sale', 'Expense', 'Stock bought'] },
  { path: '/ledger', title: 'Money Timeline', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['Filter today', 'Filter week', 'Add manual entry'] },
  { path: '/inventory', title: 'Stock', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['Add item', 'Stock in', 'Stock out'] },
  { path: '/inventory/add', title: 'Add Product', requiresSubscriptionWriteAccess: true, bottomNav: false, primaryActions: ['Name', 'Buying price', 'Quantity'] },
  { path: '/debts', title: 'Debts', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['Someone owes me', 'I owe someone', 'Record payment'] },
  { path: '/debts/new', title: 'New Debt', requiresSubscriptionWriteAccess: true, bottomNav: false, primaryActions: ['Direction', 'Amount', 'Due date'] },
  { path: '/tax', title: 'Tax Estimate', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['See daily set-aside', 'See monthly estimate'] },
  { path: '/mpesa', title: 'Mpesa', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['Connect', 'Sync', 'Simulate transaction'] },
  { path: '/subscription', title: 'Subscription', requiresSubscriptionWriteAccess: false, bottomNav: false, primaryActions: ['See trial left', 'Pay now'] },
  { path: '/settings', title: 'Settings', requiresSubscriptionWriteAccess: false, bottomNav: true, primaryActions: ['Business profile', 'Language', 'Logout'] }
];
export const appRoutes = {
  '/login': 'Phone + PIN login',
  '/onboarding': 'Business setup wizard (name, type, opening balances)',
  '/home': 'Dashboard with today profit + control cards',
  '/quick-add': '3-button quick entry (Sale, Expense, Stock Bought)',
  '/ledger': 'Timeline feed of money in/out',
  '/inventory': 'Stock list and dead stock alerts',
  '/inventory/add': 'Add product form',
  '/debts': 'Debt overview (owed to me / i owe)',
  '/debts/new': 'Create debt in 2 steps',
  '/tax': 'Tax set-aside and VAT warning',
  '/mpesa': 'Connect mpesa + transaction feed',
  '/subscription': 'Trial countdown, payment status, pay now',
  '/settings': 'Business profile, language, logout'
} as const;
