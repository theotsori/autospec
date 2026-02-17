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
