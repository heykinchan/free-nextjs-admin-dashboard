const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a subscription for a client
router.post('/client/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { productId, startDate, endDate, status } = req.body;
  try {
    const subscription = await prisma.subscription.create({
      data: {
        clientId: Number(clientId),
        productId: Number(productId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status
      }
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
  const { startDate, endDate, status } = req.body;
  try {
    const updatedSubscription = await prisma.subscription.update({
      where: { id: Number(id) },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status
      }
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
    await prisma.subscription.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

module.exports = router;
