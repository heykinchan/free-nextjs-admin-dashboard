const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");

  // Clear data carefully (clear ChangeLogs last if you want full cleanup)
  await prisma.changeLog.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Seeding new data...");

  const products = [];
  for (let i = 0; i < 10; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
        description: faker.commerce.productDescription(),
      },
    });
    products.push(product);

    // Log the product creation
    await prisma.changeLog.create({
      data: {
        action: 'SEED_CREATE_PRODUCT',
        details: `Seeded product: ${product.name}, price: ${product.price}`,
      },
    });
  }

  const clients = [];
  for (let i = 0; i < 10; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });
    clients.push(client);

    // Log the client creation
    await prisma.changeLog.create({
      data: {
        action: 'SEED_CREATE_CLIENT',
        details: `Seeded client: ${client.name}, email: ${client.email}`,
      },
    });
  }

  for (let i = 0; i < 30; i++) {
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    const subscription = await prisma.subscription.create({
      data: {
        clientId: randomClient.id,
        productId: randomProduct.id,
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        status: faker.helpers.arrayElement(["Active", "Cancelled", "Pending"]),
        customPrice: Math.random() < 0.5
          ? parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 2 }))
          : undefined, // Sometimes have custom price, sometimes not
      },
    });

    // Log the subscription creation
    await prisma.changeLog.create({
      data: {
        action: 'SEED_CREATE_SUBSCRIPTION',
        details: `Seeded subscription: Client ${subscription.clientId} subscribed to Product ${subscription.productId} with status ${subscription.status}`,
      },
    });
  }

  console.log("🌟 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });