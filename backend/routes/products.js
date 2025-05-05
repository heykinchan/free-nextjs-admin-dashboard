const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products with optional filters and pagination
router.get('/', async (req, res) => {
  const {
    name,
    year,
    unitPeriod,
    createdBy,
    page = 1,
    pageLimit = 20
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(pageLimit));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {
    ...(name && { name: { contains: name, mode: 'insensitive' } }),
    ...(year && { year: parseInt(year) }),
    ...(unitPeriod && { unitPeriod }),
    ...(createdBy && { createdBy: { contains: createdBy, mode: 'insensitive' } }),
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: Object.keys(filter).length ? filter : undefined,
        skip,
        take: parsedLimit,
        orderBy: { createdOn: 'desc' },
      }),
      prisma.product.count({
        where: Object.keys(filter).length ? filter : undefined,
      }),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);
    const itemsInPage = products.length;

    res.json({
      page: parsedPage,
      pageLimit: parsedLimit,
      total,
      totalPages,
      itemsInPage,
      data: products,
    });
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
      where: { id } // UUID, no Number()
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
  const {
    name,
    year,
    createdBy,
    unitPrice,
    unitPeriod,
    description,
    notes
  } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        year,
        createdBy,
        unitPrice,
        unitPeriod,
        description,
        notes
      }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Product',
        recordId: product.id,
        action: 'CREATE_PRODUCT',
        details: `Created product ${product.name} at $${product.unitPrice}/${product.unitPeriod.toLowerCase()}.`,
        actionBy: 'API'
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
  const {
    name,
    year,
    updatedBy,
    unitPrice,
    unitPeriod,
    description,
    notes
  } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        year,
        updatedBy,
        unitPrice,
        unitPeriod,
        description,
        notes,
        updatedOn: new Date()
      }
    });

    await prisma.changeLog.create({
      data: {
        type: 'Product',
        recordId: updatedProduct.id,
        action: 'UPDATE_PRODUCT',
        details: `Updated product ${updatedProduct.name} to $${updatedProduct.unitPrice}/${updatedProduct.unitPeriod.toLowerCase()}.`,
        actionBy: 'API'
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
    const productToDelete = await prisma.product.findUnique({ where: { id } });

    if (!productToDelete) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({ where: { id } });

    await prisma.changeLog.create({
      data: {
        type: 'Product',
        recordId: productToDelete.id,
        action: 'DELETE_PRODUCT',
        details: `Deleted product ${productToDelete.name}.`,
        actionBy: 'API'
      },
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
