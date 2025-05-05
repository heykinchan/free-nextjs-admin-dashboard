const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageLimit = Math.max(1, parseInt(req.query.pageLimit) || 20);

  const skip = (page - 1) * pageLimit;
  const take = pageLimit;

  try {
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        skip,
        take,
        include: {
          subscriptions: {
            include: { product: true }
          }
        }
      }),
      prisma.client.count()
    ]);

    const totalPages = Math.ceil(total / pageLimit);
    const itemsInPage = clients.length;

    res.json({
      page,
      pageLimit,
      total,
      totalPages,
      itemsInPage,
      data: clients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create a client
router.post('/', async (req, res) => {
  const { name, crmId, domain, notes } = req.body;
  try {
    const client = await prisma.client.create({
      data: { name, crmId, domain, notes }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Client',
        recordId: client.id,
        action: 'CREATE_CLIENT',
        details: `Client ${client.name} created.`,
        actionBy: 'API'
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
  const { name, crmId, domain, notes } = req.body;

  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: { name, crmId, domain, notes }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Client',
        recordId: updatedClient.id,
        action: 'UPDATE_CLIENT',
        details: `Updated client ${updatedClient.name}.`,
        actionBy: 'API'
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
    const clientToDelete = await prisma.client.findUnique({ where: { id } });

    if (!clientToDelete) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await prisma.client.delete({ where: { id } });

    await prisma.changeLog.create({
      data: {
        type: 'Client',
        recordId: clientToDelete.id,
        action: 'DELETE_CLIENT',
        details: `Deleted client ${clientToDelete.name}.`,
        actionBy: 'API'
      },
    });

    res.json({ message: 'Client deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;
