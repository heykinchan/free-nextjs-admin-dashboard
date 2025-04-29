const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all change logs
router.get('/', async (req, res) => {
  try {
    const changeLogs = await prisma.changeLog.findMany({
      orderBy: { createdAt: 'desc' } // Newest first
    });
    res.json(changeLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch change logs' });
  }
});

module.exports = router;