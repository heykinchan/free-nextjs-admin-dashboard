const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create a product
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, price, description }
    });

    // Also log the change
    await prisma.changeLog.create({
      data: {
        action: 'CREATE_PRODUCT',
        details: `Product ${product.name} created with price ${product.price} and description ${product.description}`,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price, description }
    });

    // Also log the change
    await prisma.changeLog.create({
      data: {
        action: 'UPDATE_PRODUCT',
        details: `Product ${updatedProduct.id} called ${updatedProduct.name} updated with price ${updatedProduct.price} and description ${updatedProduct.description}`,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the product first
    const productToDelete = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!productToDelete) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Now delete it
    await prisma.product.delete({
      where: { id: Number(id) }
    });

    // Log the deletion
    await prisma.changeLog.create({
      data: {
        action: 'DELETE_PRODUCT',
        details: `Product ${productToDelete.id} called ${productToDelete.name} with price ${productToDelete.price} and description "${productToDelete.description}" has been deleted.`,
      },
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
