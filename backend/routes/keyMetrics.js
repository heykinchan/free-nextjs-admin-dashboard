const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/dashboard/metrics
router.get('/dashboard/metrics', async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Clients on subscription
    const clientsWithSubs = await prisma.subscription.findMany({
      select: { clientId: true },
      distinct: ['clientId'],
    });
    const clientsOnSubscription = clientsWithSubs.length;

    // 2. Total revenue
    const subscriptions = await prisma.subscription.findMany({
      include: { product: true },
    });
    const totalRevenue = subscriptions.reduce(
      (acc, sub) => acc + (sub.customPrice ?? sub.product.price),
      0
    );

    // 3. Active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'Active' },
    });

    // 4. Monthly trend of new subscriptions (this year)
    const monthlyCounts = Array(12).fill(0);
    const yearSubs = await prisma.subscription.findMany({
      where: {
        startDate: {
          gte: startOfYear,
        },
      },
    });

    yearSubs.forEach((sub) => {
      const month = new Date(sub.startDate).getMonth();
      monthlyCounts[month]++;
    });

    res.json({
      clientsOnSubscription,
      totalRevenue,
      activeSubscriptions,
      monthlyNewSubscriptions: monthlyCounts,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

module.exports = router;
