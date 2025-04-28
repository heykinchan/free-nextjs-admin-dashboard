const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");

  await prisma.subscription.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Seeding new data...");

  const products = [];
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
        description: faker.commerce.productDescription(),
      },
    });
    products.push(product);
  }

  const clients = [];
  for (let i = 0; i < 50; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });
    clients.push(client);
  }

  for (let i = 0; i < 100; i++) {
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    await prisma.subscription.create({
      data: {
        clientId: randomClient.id,
        productId: randomProduct.id,
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        status: faker.helpers.arrayElement(["Active", "Cancelled", "Pending"]),
      },
    });
  }

  console.log("🌟 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
