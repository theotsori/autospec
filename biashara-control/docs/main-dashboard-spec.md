# Biashara Control — Main Dashboard Screen Spec

## 1) Exact component hierarchy

```txt
DashboardScreen
├─ TopBar
│  ├─ AppTitle("Biashara Control")
│  ├─ AppSubtitle("Daily business survival dashboard")
│  └─ SyncButton
├─ StatusBanner
│  ├─ StatusMessage
│  ├─ TodayProfitLossValue
│  └─ StatusHint
├─ QuickAddSection
│  ├─ QuickAddButton(Sale)
│  ├─ QuickAddButton(Expense)
│  ├─ QuickAddButton(StockBought)
│  └─ QuickAddButton(RecordDebt)
├─ MoneyPositionSection
│  ├─ MoneyCard(CashInHand)
│  ├─ MoneyCard(MpesaBalance)
│  ├─ MoneyCard(StockValue)
│  ├─ MoneyCard(MoneyOwedToYou)
│  └─ MoneyCard(MoneyYouOwe)
├─ BusinessHealthSection
│  ├─ HealthCard(DailyProfitTrend)
│  ├─ HealthCard(DaysSurvivable)
│  └─ HealthCard(ThisWeekVsLastWeek)
├─ SmartAlertsSection
│  └─ AlertItem[] (problem + suggested action)
├─ ActivityTimelineSection
│  └─ TimelineItem[]
└─ QuickAddModal
   ├─ AmountInput
   ├─ NoteInput
   ├─ CancelButton
   └─ SaveButton
```

## 2) Mobile layout wireframe structure

```txt
[TopBar: title + sync]
[StatusBanner: color + message + BIG number]
[QuickAdd: 2x2 big buttons]
[MoneyPosition: stacked cards]
[BusinessHealth: stacked cards]
[SmartAlerts: stacked alert cards]
[TodayActivity: stacked feed]
[Modal overlays current screen for quick add]
```

Rules:
- 1-column layout on cheap Android screens (320px+).
- Touch targets minimum 48px.
- Max width 460px centered.
- No navigation required for daily actions.

## 3) State logic (how colors change)

### Daily profit formula
`todayProfit = saleToday - expenseToday - stockBoughtToday`

### Status banner states
- **GREEN**: `todayProfit > 600`
  - Message: `You made money today 👍`
- **YELLOW**: `-500 <= todayProfit <= 600`
  - Message: `You are close to zero profit`
- **RED**: `todayProfit < -500`
  - Message: `You are losing money today ⚠️`

### Additional status hint logic
- If offline: show offline hint and keep local actions queued.
- If `syncPending > 0`: append queued count in hint.

## 4) Data fields required

```ts
interface DashboardData {
  // core day inputs
  saleToday: number;
  expenseToday: number;
  stockBoughtToday: number;

  // money position
  cashInHand: number;
  mpesaBalance: number;
  stockValue: number;
  moneyOwedToYou: number;
  moneyYouOwe: number;

  // health
  thisWeekProfit: number;
  lastWeekProfit: number;
  burnRateDaily: number;

  // alerts source
  lowStockItems: number;
  overdueDebts: number;
  highExpenseFlag: boolean;
  taxReminderDays: number;

  // app state
  offline: boolean;
  syncPending: number;

  // timeline
  timeline: Array<{
    time: string;
    text: string;
    type?: 'sale' | 'expense' | 'stock' | 'debt' | 'sync';
  }>;
}
```

## 5) Interaction behavior

- Tapping any quick-add button opens modal instantly (no route change).
- Save validates `amount > 0`, updates state, adds timeline entry, increments `syncPending`.
- Sync button:
  - Online: sends queued actions; on success sets `syncPending = 0`.
  - Offline: shows queued state; retries when back online.
- Activity updates in real-time after each save.
- Full daily flow under 3 taps:
  - Tap quick-add → enter amount → save.

## 6) Empty state behavior (new user)

When no entries exist today:
- Status banner defaults to yellow with:
  - Message: `You are close to zero profit`
  - Profit: `KES 0`
  - Hint: `Start by recording your first sale or expense.`
- Smart alerts panel:
  - `No urgent alerts. Add your first records to get smart reminders.`
- Timeline:
  - `No activity yet. Tap “Sale” or “Expense” to begin.`

## 7) Error states (offline, no data, sync pending)

### Offline
- Keep full dashboard available from cached/local values.
- Status hint: `Offline mode: saved on this phone. Sync when internet returns.`
- Disable network-only interactions, keep quick-add active.

### No data from backend
- Show last-known values if available.
- If no cache, show skeletal placeholders and CTA: `Try again`.
- Never blank screen.

### Sync pending
- Show pending count in status hint.
- Timeline items created locally marked as pending (optional icon).
- On successful sync remove pending marks and decrement count.
