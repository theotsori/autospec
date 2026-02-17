const state = {
  offline: false,
  syncPending: 2,
  saleToday: 6200,
  expenseToday: 2100,
  stockBoughtToday: 1400,
  cashInHand: 12750,
  mpesaBalance: 5300,
  stockValue: 48400,
  moneyOwedToYou: 9100,
  moneyYouOwe: 5600,
  thisWeekProfit: 21400,
  lastWeekProfit: 16900,
  burnRateDaily: 690,
  lowStockItems: 2,
  overdueDebts: 3,
  highExpenseFlag: false,
  taxReminderDays: 4,
  timeline: [
    { time: '9:30 AM', text: 'Sale recorded: KES 1,500 (Milk + Bread)' },
    { time: '10:10 AM', text: 'Expense added: KES 400 (Transport)' },
    { time: '11:45 AM', text: 'Debt collected: KES 700 (Mary)' }
  ]
};

const currency = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 });
const statusBanner = document.getElementById('statusBanner');
const statusMessage = document.getElementById('statusMessage');
const todayProfitEl = document.getElementById('todayProfit');
const statusHint = document.getElementById('statusHint');
const moneyCards = document.getElementById('moneyCards');
const healthList = document.getElementById('healthList');
const alertsPanel = document.getElementById('alertsPanel');
const timelineEl = document.getElementById('timeline');
const modal = document.getElementById('quickAddModal');
const quickAddForm = document.getElementById('quickAddForm');
const modalTitle = document.getElementById('modalTitle');
const modalAmount = document.getElementById('modalAmount');
const modalNote = document.getElementById('modalNote');
const syncBtn = document.getElementById('syncBtn');

let activeType = null;

function profitToday() {
  return state.saleToday - state.expenseToday - state.stockBoughtToday;
}

function getStatusMeta() {
  const p = profitToday();
  if (p > 600) return { tone: 'green', message: 'You made money today 👍', hint: 'Keep it up. Record sales and expenses as they happen.' };
  if (p >= -500) return { tone: 'yellow', message: 'You are close to zero profit', hint: 'You are almost at break-even. Watch expenses closely.' };
  return { tone: 'red', message: 'You are losing money today ⚠️', hint: 'Take action now: push sales and reduce spending.' };
}

function renderStatus() {
  const p = profitToday();
  const meta = getStatusMeta();
  statusBanner.classList.remove('green', 'yellow', 'red');
  statusBanner.classList.add(meta.tone);
  statusMessage.textContent = meta.message;
  todayProfitEl.textContent = `${p < 0 ? '-' : ''}${currency.format(Math.abs(p))}`;

  if (state.offline) {
    statusHint.textContent = 'Offline mode: data saved on this phone. Sync when internet returns.';
  } else if (state.syncPending > 0) {
    statusHint.textContent = `${meta.hint} ${state.syncPending} item(s) waiting to sync.`;
  } else {
    statusHint.textContent = meta.hint;
  }
}

function renderMoneyCards() {
  const cards = [
    ['Cash in Hand', state.cashInHand, 'Actual money you can spend now'],
    ['Mpesa Balance', state.mpesaBalance, 'Money available in Mpesa wallet'],
    ['Stock Value', state.stockValue, 'Value of items still in your shop'],
    ['Money Owed to You', state.moneyOwedToYou, 'Customers haven’t paid yet'],
    ['Money You Owe', state.moneyYouOwe, 'Bills and supplier balances to pay']
  ];

  moneyCards.innerHTML = cards.map(([name, value, explanation]) => `
    <article class="row-card">
      <div class="row-main"><span>${name}</span><span>${currency.format(value)}</span></div>
      <div class="row-sub">${explanation}</div>
    </article>
  `).join('');
}

function trendBadge() {
  const p = profitToday();
  if (p > 600) return '<span class="badge up">↑ Up</span>';
  if (p >= -500) return '<span class="badge flat">→ Flat</span>';
  return '<span class="badge down">↓ Down</span>';
}

function renderHealth() {
  const survivableDays = state.burnRateDaily > 0
    ? Math.floor((state.cashInHand + state.mpesaBalance) / state.burnRateDaily)
    : 30;
  const weekDelta = state.thisWeekProfit - state.lastWeekProfit;

  healthList.innerHTML = `
    <article class="row-card">
      <div class="row-main"><span>Daily profit trend</span>${trendBadge()}</div>
      <div class="row-sub">Based on what happened today.</div>
    </article>
    <article class="row-card">
      <div class="row-main"><span>Days survivable</span><span>${survivableDays} days</span></div>
      <div class="row-sub">You can survive ${survivableDays} days without new sales.</div>
    </article>
    <article class="row-card">
      <div class="row-main"><span>This week vs last week</span><span>${weekDelta >= 0 ? '+' : ''}${currency.format(weekDelta)}</span></div>
      <div class="row-sub">${weekDelta >= 0 ? 'Better than last week.' : 'Lower than last week.'}</div>
    </article>
  `;
}

function buildAlerts() {
  const alerts = [];
  if (state.lowStockItems > 0) alerts.push(`Low stock: ${state.lowStockItems} item(s) running out — reorder today.`);
  if (state.overdueDebts > 0) alerts.push(`${state.overdueDebts} customers haven’t paid for 14+ days — remind them.`);
  if (state.highExpenseFlag) alerts.push('Expenses are high today — pause non-essential spending.');
  if (state.taxReminderDays <= 7) alerts.push(`Tax reminder: set aside tax money now — due in ${state.taxReminderDays} day(s).`);
  return alerts;
}

function renderAlerts() {
  const alerts = buildAlerts();
  if (!alerts.length) {
    alertsPanel.innerHTML = '<div class="empty">No urgent alerts. You are on track today.</div>';
    return;
  }
  alertsPanel.innerHTML = alerts.map((a) => `<article class="row-card"><div class="row-sub">⚠️ ${a}</div></article>`).join('');
}

function renderTimeline() {
  if (!state.timeline.length) {
    timelineEl.innerHTML = '<div class="empty">No activity yet. Tap “Sale” or “Expense” to start your day.</div>';
    return;
  }
  timelineEl.innerHTML = state.timeline.map((item) => `
    <article class="row-card">
      <div class="row-main"><span>${item.text}</span><span>${item.time}</span></div>
    </article>
  `).join('');
}

function openModal(type) {
  activeType = type;
  modalTitle.textContent = {
    sale: 'Add Sale',
    expense: 'Add Expense',
    stock: 'Add Stock Bought',
    debt: 'Record Debt'
  }[type];
  modalAmount.value = '';
  modalNote.value = '';
  modal.showModal();
}

function applyQuickAdd(type, amount, note) {
  if (type === 'sale') state.saleToday += amount;
  if (type === 'expense') state.expenseToday += amount;
  if (type === 'stock') state.stockBoughtToday += amount;
  if (type === 'debt') state.moneyOwedToYou += amount;
  state.syncPending += 1;
  const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const label = { sale: 'Sale recorded', expense: 'Expense added', stock: 'Stock bought', debt: 'Debt recorded' }[type];
  state.timeline.unshift({ time, text: `${label}: ${currency.format(amount)}${note ? ` (${note})` : ''}` });
}

function renderAll() {
  renderStatus();
  renderMoneyCards();
  renderHealth();
  renderAlerts();
  renderTimeline();
}

function renderEmptyStateIfNeeded() {
  const noActivity = state.saleToday === 0 && state.expenseToday === 0 && state.stockBoughtToday === 0 && state.timeline.length === 0;
  if (!noActivity) return;
  alertsPanel.innerHTML = '<div class="empty">Welcome! Start by adding your first sale, expense, or stock purchase.</div>';
  timelineEl.innerHTML = '<div class="empty">Your day timeline will appear here after the first entry.</div>';
}

document.querySelectorAll('.quick-btn').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.type));
});

quickAddForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!activeType) return;
  const amount = Number(modalAmount.value);
  if (!amount || amount < 1) return;
  applyQuickAdd(activeType, amount, modalNote.value.trim());
  modal.close();
  renderAll();
});

syncBtn.addEventListener('click', () => {
  if (state.offline) {
    state.offline = false;
    state.syncPending = Math.max(0, state.syncPending - 1);
  } else {
    state.syncPending = 0;
  }
  renderAll();
});

window.addEventListener('offline', () => {
  state.offline = true;
  renderAll();
});
window.addEventListener('online', () => {
  state.offline = false;
  renderAll();
});

renderAll();
renderEmptyStateIfNeeded();
