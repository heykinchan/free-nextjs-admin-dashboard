const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");

  await prisma.invoice.deleteMany({});
  await prisma.changeLog.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Seeding new data...");

  // Generating Product dummy data
  const products = [];
  for (let i = 0; i < 10; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        year: faker.date.past({ years: 3 }).getFullYear(),
        createdBy: faker.internet.username(),
        unitPrice: parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 })),
        unitPeriod: faker.helpers.arrayElement(["MONTHLY", "ANNUALLY"]),
        description: faker.commerce.productDescription(),
        notes: faker.lorem.sentence(),
      },
    });
    products.push(product);

    await prisma.changeLog.create({
      data: {
        type: "Product",
        recordId: product.id,
        action: 'SEED_CREATE_PRODUCT',
        details: `Seeded product: ${product.name}, price: ${product.unitPrice}`,
        actionBy: "Seeder"
      },
    });
  }

  // Generating Client dummy data
  const clients = [];
  for (let i = 0; i < 10; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.person.fullName(),
        crmId: faker.string.uuid(),
        domain: faker.internet.domainName(),
        notes: faker.lorem.sentence(),
      },
    });
    clients.push(client);

    await prisma.changeLog.create({
      data: {
        type: "Client",
        recordId: client.id,
        action: 'SEED_CREATE_CLIENT',
        details: `Seeded client: ${client.name}`,
        actionBy: "Seeder"
      },
    });
  }

  // Generating Subscription dummy data
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
        discount: Math.random() < 0.4
          ? parseFloat(faker.commerce.price({ min: 1, max: 30, dec: 2 }))
          : null,
        term: faker.lorem.word()
      },
    });

    await prisma.changeLog.create({
      data: {
        type: "Subscription",
        recordId: subscription.id,
        action: 'SEED_CREATE_SUBSCRIPTION',
        details: `Client ${subscription.clientId} subscribed to Product ${subscription.productId}`,
        actionBy: "Seeder"
      },
    });

    // Optional invoice
    if (Math.random() < 0.8) {
      await prisma.invoice.create({
        data: {
          subscriptionId: subscription.id,
          refNo: faker.string.uuid(),
          xeroId: Math.random() < 0.5 ? faker.string.uuid() : null,
          amount: subscription.discount
            ? subscription.discount + randomProduct.unitPrice
            : randomProduct.unitPrice,
          createdBy: faker.internet.username(),
          payDate: Math.random() < 0.5 ? faker.date.recent() : null,
          serviceStart: subscription.startDate,
          serviceEnd: subscription.endDate,
        },
      });
    }
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
