const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Org & User
  const org = await prisma.org.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: { id: 'demo-org', name: 'Demo Org' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { name: 'Demo User' },
    create: { email: 'demo@example.com', name: 'Demo User' },
  });

  await prisma.membership.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id, role: 'OWNER' },
  });

  // Contacts
  const contactsData = [
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
    { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' },
    { firstName: 'Carol', lastName: 'Davis', email: 'carol@example.com' },
  ];

  const contacts = [];
  for (const data of contactsData) {
    const contact = await prisma.contact.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });
    contacts.push(contact);
  }

  // Segment with members if model exists
  if (prisma.segment && prisma.segmentMember) {
    const segment = await prisma.segment.upsert({
      where: { id: 'segment-all' },
      update: {},
      create: {
        id: 'segment-all',
        orgId: org.id,
        name: 'All Contacts',
        dslJson: {},
      },
    });

    for (const contact of contacts) {
      await prisma.segmentMember.upsert({
        where: {
          segmentId_contactId: {
            segmentId: segment.id,
            contactId: contact.id,
          },
        },
        update: {},
        create: {
          segmentId: segment.id,
          contactId: contact.id,
          orgId: org.id,
        },
      });
    }
  }

  // Email templates
  const templates = [
    {
      id: 'template-welcome',
      name: 'Welcome Email',
      html: '<h1>Welcome to Demo Org</h1>',
    },
    {
      id: 'template-newsletter',
      name: 'Monthly Newsletter',
      html: '<h1>News</h1>',
    },
  ];

  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        contentJson: {},
        createdBy: user.id,
        snapshots: {
          create: { html: t.html },
        },
      },
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
