const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'demo@biashara.app';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash('password123', 10),
      businessName: 'Demo Salon',
      businessType: 'Salon'
    }
  });

  await prisma.wallet.create({ data: { userId: user.id, cash: 5000, mpesa: 2500 } });

  await prisma.product.createMany({
    data: [
      { userId: user.id, name: 'Shampoo', unitCost: 350, quantity: 10 },
      { userId: user.id, name: 'Hair Food', unitCost: 280, quantity: 8 },
      { userId: user.id, name: 'Relaxer', unitCost: 500, quantity: 6 }
    ]
  });
}

main().finally(async () => prisma.$disconnect());
