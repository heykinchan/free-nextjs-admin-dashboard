const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: { subscriptions: { include: { product: true } } }
    });
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create a client
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const client = await prisma.client.create({
      data: { name, email }
    });

    // Log the change
    await prisma.changeLog.create({
      data: {
        action: 'CREATE_CLIENT',
        details: `Client ${client.name} created with email ${client.email}`,
      },
    });

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update a client
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: { name, email }
    });

    // Log the update
    await prisma.changeLog.create({
      data: {
        action: 'UPDATE_CLIENT',
        details: `Client ${updatedClient.id} updated to name ${updatedClient.name} and email ${updatedClient.email}`,
      },
    });

    res.json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch client first
    const clientToDelete = await prisma.client.findUnique({
      where: { id: Number(id) }
    });

    if (!clientToDelete) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete client
    await prisma.client.delete({
      where: { id: Number(id) }
    });

    // Log the deletion
    await prisma.changeLog.create({
      data: {
        action: 'DELETE_CLIENT',
        details: `Client ${clientToDelete.id} named ${clientToDelete.name} with email ${clientToDelete.email} has been deleted.`,
      },
    });

    res.json({ message: 'Client deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;