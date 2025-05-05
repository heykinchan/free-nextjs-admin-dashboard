const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /subscriptions
// Supports filters: clientId, productId, status, term
// Supports pagination: page, pageLimit
router.get('/', async (req, res) => {
  const {
    clientId,
    productId,
    status,
    term,
    page = 1,
    pageLimit = 20
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(pageLimit));
  const skip = (parsedPage - 1) * parsedLimit;

  // Build dynamic filter object
  const filter = {
    ...(clientId && { clientId }),
    ...(productId && { productId }),
    ...(status && { status }),
    ...(term && { term }),
  };

  try {
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: filter,
        skip,
        take: parsedLimit,
        orderBy: { startDate: 'desc' },
        include: {
          client: true,
          product: true,
        }
      }),
      prisma.subscription.count({ where: filter })
    ]);

    const totalPages = Math.ceil(total / parsedLimit);
    const itemsInPage = subscriptions.length;

    res.json({
      page: parsedPage,
      pageLimit: parsedLimit,
      total,
      totalPages,
      itemsInPage,
      data: subscriptions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get a single subscription by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { product: true, client: true },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create a subscription for a client
router.post('/client/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { productId, startDate, endDate, status, discount, term } = req.body;

  try {
    const subscription = await prisma.subscription.create({
      data: {
        clientId,
        productId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        discount: discount ? parseFloat(discount) : undefined,
        term
      }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Subscription',
        recordId: subscription.id,
        action: 'CREATE_SUBSCRIPTION',
        details: `Subscription created for client ${clientId} to product ${productId}.`,
        actionBy: 'API'
      },
    });

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update a subscription
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, status, discount, term } = req.body;

  try {
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        discount: discount ? parseFloat(discount) : undefined,
        term
      }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Subscription',
        recordId: updatedSubscription.id,
        action: 'UPDATE_SUBSCRIPTION',
        details: `Updated subscription ${updatedSubscription.id} with status ${updatedSubscription.status}.`,
        actionBy: 'API'
      },
    });

    res.json(updatedSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Delete a subscription
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const subscriptionToDelete = await prisma.subscription.findUnique({
      where: { id }
    });

    if (!subscriptionToDelete) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await prisma.subscription.delete({ where: { id } });

    await prisma.changeLog.create({
      data: {
        type: 'Subscription',
        recordId: subscriptionToDelete.id,
        action: 'DELETE_SUBSCRIPTION',
        details: `Deleted subscription for client ${subscriptionToDelete.clientId}.`,
        actionBy: 'API'
      },
    });

    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

module.exports = router;
