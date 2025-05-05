const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /invoices?subscriptionId=...&page=1&pageLimit=20
 router.get('/', async (req, res) => {
   const {
     subscriptionId,
     page = 1,
     pageLimit = 20,
   } = req.query;

   const parsedPage = Math.max(1, parseInt(page));
   const parsedLimit = Math.max(1, parseInt(pageLimit));
   const skip = (parsedPage - 1) * parsedLimit;

   const filter = {
     ...(subscriptionId && { subscriptionId }),
   };

   try {
     const [invoices, total] = await Promise.all([
       prisma.invoice.findMany({
         where: Object.keys(filter).length ? filter : undefined,
         skip,
         take: parsedLimit,
         orderBy: { createdOn: 'desc' },
         include: {
           subscription: {
             include: {
               client: true,
               product: true,
             }
           }
         }
       }),
       prisma.invoice.count({ where: filter })
     ]);

     const totalPages = Math.ceil(total / parsedLimit);
     const itemsInPage = invoices.length;

     res.json({
       page: parsedPage,
       pageLimit: parsedLimit,
       total,
       totalPages,
       itemsInPage,
       data: invoices
     });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Failed to fetch invoices' });
   }
 });

// GET /invoices/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        subscription: {
          include: { client: true, product: true }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// POST /invoices
router.post('/', async (req, res) => {
  const {
    subscriptionId,
    refNo,
    xeroId,
    amount,
    createdBy,
    payDate,
    serviceStart,
    serviceEnd
  } = req.body;

  try {
    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId,
        refNo,
        xeroId,
        amount,
        createdBy,
        payDate: payDate ? new Date(payDate) : null,
        serviceStart: new Date(serviceStart),
        serviceEnd: new Date(serviceEnd),
      }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Invoice',
        recordId: invoice.id,
        action: 'CREATE_INVOICE',
        details: `Invoice created for subscription ${subscriptionId} with amount $${amount}.`,
        actionBy: createdBy || 'API',
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// PUT /invoices/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    refNo,
    xeroId,
    amount,
    updatedBy,
    payDate,
    serviceStart,
    serviceEnd
  } = req.body;

  try {
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        refNo,
        xeroId,
        amount,
        updatedBy,
        updatedOn: new Date(),
        payDate: payDate ? new Date(payDate) : null,
        serviceStart: new Date(serviceStart),
        serviceEnd: new Date(serviceEnd),
      }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Invoice',
        recordId: updated.id,
        action: 'UPDATE_INVOICE',
        details: `Invoice ${updated.id} updated with amount $${updated.amount}.`,
        actionBy: updatedBy || 'API',
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// DELETE /invoices/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await prisma.invoice.delete({ where: { id } });

    await prisma.changeLog.create({
      data: {
        type: 'Invoice',
        recordId: id,
        action: 'DELETE_INVOICE',
        details: `Invoice ${id} deleted.`,
        actionBy: 'API'
      }
    });

    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router;
