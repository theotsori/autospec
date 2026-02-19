# autospec

## Biashara Control web dashboard (mobile-first)

This repository now includes a production-ready mobile dashboard prototype for:

**Biashara Control — Daily business survival dashboard for small businesses in Kenya**

Path: `web/`

### What is implemented
- Status banner with instant safety signal (green/yellow/red) and large daily profit/loss
- 4 quick-add actions (Sale, Expense, Stock Bought, Record Debt) via instant modal
- Money position cards with simple explanations
- Business health cards (trend, survivable days, week comparison)
- Smart alerts with suggested actions
- Human-readable activity timeline
- Empty states and error-state handling (offline + sync pending)

### Run locally
```bash
cd /workspace/autospec
python3 -m http.server 4173
```
Open `http://localhost:4173/web/`.
