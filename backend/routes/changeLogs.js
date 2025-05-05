const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get change logs with pagination and optional filtering
router.get('/', async (req, res) => {
  const {
    type,
    action,
    actionBy,
    page = 1,
    pageLimit = 20,
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(pageLimit));
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    const where = {
      ...(type && { type }),
      ...(action && { action }),
      ...(actionBy && { actionBy }),
    };

    const [changeLogs, total] = await Promise.all([
      prisma.changeLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parsedLimit,
      }),
      prisma.changeLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);
    const itemsInPage = changeLogs.length;

    res.json({
      page: parsedPage,
      pageLimit: parsedLimit,
      total,
      totalPages,
      itemsInPage,
      data: changeLogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch change logs' });
  }
});

module.exports = router;
