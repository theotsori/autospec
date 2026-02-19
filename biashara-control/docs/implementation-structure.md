# Biashara Control — Production Implementation Structure

## 1) Database Schema
- File: `biashara-control/db/schema.sql`
- Core tables: `businesses`, `owners`, `subscriptions`, `wallets`, `ledger_entries`, `inventory_items`, `inventory_events`, `debts`, `debt_payments`, `tax_profiles`, `daily_snapshots`, `mpesa_connections`, `mpesa_transactions`, `device_sync_queue`.

## 2) API Routes
- File: `biashara-control/backend/src/routes/api-contract.yaml`
- Auth: `/auth/signup`, `/auth/login`, `/auth/refresh`
- Dashboard: `/dashboard/today`, `/metrics/profit`
- Money: `/ledger/entries`, `/wallets`
- Inventory: `/inventory/items`, `/inventory/events`, `/inventory/alerts`
- Debts: `/debts`, `/debts/{debtId}/payments`, `/debts/reminders`
- Tax: `/tax/estimate`
- M-Pesa mock: `/mpesa/connect`, `/mpesa/simulate`, `/mpesa/transactions`
- Subscription: `/subscription/status`, `/subscription/payments/initiate`, `/subscription/payments/webhook`
- Offline sync: `/offline/sync`

## 3) Frontend Page Structure
- File: `biashara-control/frontend/src/app/routes.ts`
- Mobile-first pages: login, onboarding, home, quick-add, ledger timeline, inventory, debts, tax, mpesa, subscription, settings.

## 4) UI Component List
- File: `biashara-control/frontend/src/components/component-registry.ts`
- Components: `ProfitHeroCard`, `QuickActionButtonXL`, `DebtReminderCard`, `TaxSetAsideCard`, `OfflineSyncIndicator`, `LockedStateOverlay`, etc.

## 5) Business Logic Formulas
- File: `biashara-control/backend/src/services/business-math.ts`
- Formulas:
  - `daily_profit = sales - expenses - stock_bought`
  - `weekly_profit = sum(last_7_daily_profit)`
  - `monthly_profit = sum(last_30_daily_profit)`
  - `burn_rate = abs(avg(last_7_daily_profit)) when avg < 0 else 0`
  - `tax_set_aside_daily = max(0, daily_profit * tax_rate)`
  - `monthly_tax_estimate = max(0, month_to_date_profit * tax_rate)`
  - `vat_warning = annualized_30d_sales >= vat_threshold * warning_ratio`

## 6) M-Pesa Mock Integration
- File: `biashara-control/backend/src/modules/mpesa-mock.ts`
- Deliverables:
  - Message-based auto-category inference
  - Synthetic webhook payload builder
  - Categories: `sale`, `expense`, `supplier_payment`, `owner_withdrawal`, `transfer`

## 7) Subscription Logic
- File: `biashara-control/backend/src/services/subscription.ts`
- Rules:
  - 14-day trial on signup
  - Price KES 3000 / month
  - State machine: `trialing -> active -> past_due -> locked`
  - 7-day grace after due date, then lock writes
  - Data always readable, never deleted

## 8) Step-by-Step Build Order
1. Initialize monorepo (`frontend`, `backend`, `db`, `infra`) and CI.
2. Implement PostgreSQL schema + migrations + seed trial business.
3. Implement auth (owner-only) and JWT middleware.
4. Implement subscription middleware and lock gate.
5. Build ledger + wallet services (manual entry first).
6. Build dashboard endpoint + daily snapshot cron.
7. Build inventory module and dead-stock job.
8. Build debts module + reminders endpoint.
9. Build tax estimator service + VAT threshold warning.
10. Build M-Pesa mock ingestion + auto-categorization.
11. Implement offline sync queue endpoints.
12. Build Next.js mobile screens and reusable card components.
13. Add caching (Redis) for dashboard and daily metrics.
14. Add observability (logs, tracing, uptime checks, alerting).
15. Add billing flows, renewal webhooks, and auto-lock scheduler.
16. Add load/perf tests for 500 active businesses.
17. Release v1 with backups, recovery runbook, and support playbook.
