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
