# Biashara Control MVP (Next.js + Prisma + SQLite)

## 1. Folder structure

```txt
biashara-control/frontend
├── app
│   ├── (auth)
│   │   ├── login/page.js
│   │   └── signup/page.js
│   ├── onboarding/page.js
│   ├── dashboard/page.js
│   ├── api
│   │   ├── auth/{signup,login,logout}/route.js
│   │   ├── onboarding/route.js
│   │   ├── dashboard/route.js
│   │   ├── sales/route.js
│   │   ├── expenses/route.js
│   │   ├── stock/route.js
│   │   ├── debts/route.js
│   │   ├── debts/[id]/pay/route.js
│   │   └── mpesa/simulate/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components
│   ├── QuickEntryForm.js
│   └── StatCard.js
├── lib
│   ├── auth.js
│   ├── calc.js
│   ├── dashboard.js
│   └── prisma.js
├── prisma
│   ├── schema.prisma
│   └── seed.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.mjs
└── .env.example
```

## 2. Database schema (Prisma)
See: `prisma/schema.prisma`

## 3. API routes
See: `app/api/**/route.js`

## 4. Main React pages
- `app/(auth)/signup/page.js`
- `app/(auth)/login/page.js`
- `app/onboarding/page.js`
- `app/dashboard/page.js`

## 5. Key components
- `components/QuickEntryForm.js`
- `components/StatCard.js`

## 6. Calculation utilities
- `lib/calc.js`
- `lib/dashboard.js`

## 7. Seed data
- `prisma/seed.js`
- demo user: `demo@biashara.app` / `password123`

## 8. Run locally

```bash
cd biashara-control/frontend
cp .env.example .env
npm install
npm run prisma:generate
npx prisma db push
npm run prisma:seed
npm run dev
```

Open: `http://localhost:3000`
