const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Import routes
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const subscriptionRoutes = require('./routes/subscriptions');
const changeLogRoutes = require('./routes/changelogs');
const keyMetricsRoutes = require('./routes/keyMetrics');

// Use routes
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/changelogs', changeLogRoutes);
app.use('/api', keyMetricsRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
