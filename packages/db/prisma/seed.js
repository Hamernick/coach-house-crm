const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const contacts = [
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
    { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' },
    { firstName: 'Carol', lastName: 'Davis', email: 'carol@example.com' }
  ];

  for (const data of contacts) {
    await prisma.contact.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
