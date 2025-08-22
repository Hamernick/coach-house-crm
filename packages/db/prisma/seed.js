const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.org.create({
    data: { name: 'Seed Org' },
  });

  const contacts = [
    { firstName: 'Alice', lastName: 'Johnson', primaryEmail: 'alice@example.com', type: 'Individual' },
    { firstName: 'Bob', lastName: 'Smith', primaryEmail: 'bob@example.com', type: 'Individual' },
    { firstName: 'Carol', lastName: 'Davis', primaryEmail: 'carol@example.com', type: 'Individual' },
  ];

  await prisma.contact.createMany({
    data: contacts.map((c) => ({ ...c, orgId: org.id })),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
