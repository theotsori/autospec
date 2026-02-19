# Biashara Control Implementation Output

## 1. Database schema
- `db/schema.sql`
- entities:
  - tenancy: `businesses`, `owners`
  - monetization: `subscriptions`, `subscription_payments`
  - money core: `wallets`, `ledger_entries`
  - stock: `inventory_items`, `inventory_events`
  - debts: `debts`, `debt_payments`
  - compliance: `tax_profiles`
  - analytics: `daily_snapshots`
  - mpesa: `mpesa_connections`, `mpesa_transactions`
  - offline: `device_sync_queue`
- constraints:
  - unique phone per business
  - idempotency keys for ledger + sync
  - KES positive checks
- multitenancy protection:
  - row-level security on `ledger_entries`, `inventory_items`, `debts`
  - session scoped by `app.business_id`

## 2. API routes
- `backend/src/routes/api-contract.yaml`
- auth: `POST /auth/signup`, `POST /auth/login`
- dashboard: `GET /dashboard/today`, `GET /metrics/profit`
- ledger: `POST /ledger/entries`, `GET /ledger/entries`
- inventory: `POST /inventory/items`, `GET /inventory/items`, `GET /inventory/alerts`
- debts: `POST /debts`, `GET /debts`
- tax: `GET /tax/estimate`
- mpesa: `POST /mpesa/simulate`
- subscription: `GET /subscription/status`, `POST /subscription/payments/initiate`
- offline: `POST /offline/sync`

## 3. Frontend page structure
- `frontend/src/app/routes.ts`
- `frontend/src/app/App.tsx`
- pages:
  - `/login`
  - `/onboarding`
  - `/home`
  - `/quick-add`
  - `/ledger`
  - `/inventory`
  - `/inventory/add`
  - `/debts`
  - `/debts/new`
  - `/tax`
  - `/mpesa`
  - `/subscription`
  - `/settings`

## 4. UI component list
- `frontend/src/components/component-registry.ts`
- implemented mobile UI shell, tabs, quick-add modal, and action cards in `frontend/src/app/App.tsx`
- components:
  - `ProfitHeroCard`
  - `WalletBalancesCard`
  - `BusinessHealthStrip`
  - `QuickActionButtonXL`
  - `QuickAddBottomSheet`
  - `MpesaSyncStatusChip`
  - `InventoryItemCard`
  - `DeadStockAlertCard`
  - `DebtReminderCard`
  - `TaxSetAsideCard`
  - `VatThresholdWarningCard`
  - `SubscriptionTrialBanner`
  - `LockedStateOverlay`
  - `OfflineSyncIndicator`

## 5. Business logic formulas
- `backend/src/services/business-math.ts`
- formulas:
  - `daily_profit = sales - expenses - stock_bought`
  - `weekly_profit = sum(last_7_days_profit)`
  - `monthly_profit = sum(last_30_days_profit)`
  - `burn_rate = abs(avg(last_7_days_profit)) when avg < 0 else 0`
  - `growth_vs_yesterday_pct = (today - yesterday) / abs(yesterday) * 100`
  - `daily_tax_set_aside = max(0, daily_profit * tax_rate)`
  - `monthly_tax_estimate = max(0, mtd_profit * tax_rate)`
  - `vat_warning = annualized_30d_sales >= vat_threshold * warning_ratio`

## 6. Mpesa mock integration
- `backend/src/modules/mpesa-mock.ts`
- flow:
  - accept `amountKes`, `msisdn`, `message`, `happenedAt`
  - infer category from message
  - map category -> ledger type
  - generate mock webhook payload with unique transaction id
  - persist raw payload + mapped ledger entry id

## 7. Subscription logic
- `backend/src/services/subscription.ts`
- rules:
  - 14-day trial
  - plan KES 3000/month
  - state machine `trialing -> active -> past_due -> locked`
  - grace period 7 days
  - locked: read-only data, write denied
  - payment extends `paid_until` by 1+ months

## 8. Step-by-step build order
1. create monorepo apps (`frontend`, `backend`) + shared package (`types`) + docker compose (postgres, redis)
2. apply `db/schema.sql` via migration tool
3. implement auth module (signup/login/jwt/refresh)
4. implement tenant middleware from JWT -> `x-business-id`
5. implement subscription middleware and write lock gate
6. implement ledger module and wallet updates
7. implement dashboard queries + redis cache keys
8. implement inventory module + dead stock and fast mover query
9. implement debts module + overdue risk scoring
10. implement tax estimator endpoint
11. implement mpesa mock webhook ingestion + auto-categorization
12. implement offline sync endpoint with idempotency
13. build Next.js mobile screens and card components
14. add background jobs (daily snapshots, subscription lock scheduler)
15. add observability, backup, restore, and performance tests for 500 businesses
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
