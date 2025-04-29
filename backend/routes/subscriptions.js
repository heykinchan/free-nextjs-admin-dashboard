const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Get subscriptions for a specific client
router.get('/client/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { clientId: Number(clientId) },
      include: { product: true }, // If you want product name shown in form
    });
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch client subscriptions' });
  }
});

// Get a single subscription by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(id) },
      include: { product: true, client: true }, // optional: include related info
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
  const { productId, startDate, endDate, status, customPrice } = req.body;
  try {
    const subscription = await prisma.subscription.create({
      data: {
        clientId: Number(clientId),
        productId: Number(productId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        customPrice: customPrice ? parseFloat(customPrice) : undefined,
      }
    });

    // Log the creation
    await prisma.changeLog.create({
      data: {
        action: 'CREATE_SUBSCRIPTION',
        details: `Subscription ${subscription.id} created for client ${subscription.clientId} with product ${subscription.productId}`,
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
  const { startDate, endDate, status, customPrice } = req.body;
  try {
    const updatedSubscription = await prisma.subscription.update({
      where: { id: Number(id) },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        customPrice: customPrice ? parseFloat(customPrice) : undefined,
      }
    });

    // Log the update
    await prisma.changeLog.create({
      data: {
        action: 'UPDATE_SUBSCRIPTION',
        details: `Subscription ${updatedSubscription.id} updated with status ${updatedSubscription.status}`,
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
    // Fetch subscription first
    const subscriptionToDelete = await prisma.subscription.findUnique({
      where: { id: Number(id) }
    });

    if (!subscriptionToDelete) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Delete subscription
    await prisma.subscription.delete({
      where: { id: Number(id) }
    });

    // Log the deletion
    await prisma.changeLog.create({
      data: {
        action: 'DELETE_SUBSCRIPTION',
        details: `Subscription ${subscriptionToDelete.id} deleted for client ${subscriptionToDelete.clientId}`,
      },
    });

    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

module.exports = router;