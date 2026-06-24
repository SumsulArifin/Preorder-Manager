import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const preorders = [
    {
      name: "Multi variant 3",
      products: 3,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T08:24:00"),
      endsAt: new Date("2026-03-15T08:24:00"),
      isActive: true,
    },
    {
      name: "Multi variant 2",
      products: 2,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2025-11-10T10:00:00"),
      endsAt: null,
      isActive: true,
    },
    {
      name: "Multi variants 1",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-10-01T12:00:00"),
      endsAt: null,
      isActive: false,
    },
    {
      name: "Partial payment",
      products: 5,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2026-01-05T09:00:00"),
      endsAt: new Date("2026-06-05T09:00:00"),
      isActive: true,
    },
    {
      name: "Shipping not sure",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2026-02-20T14:30:00"),
      endsAt: null,
      isActive: true,
    },
    {
      name: "Full payment",
      products: 4,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2026-03-01T00:00:00"),
      endsAt: new Date("2026-09-01T00:00:00"),
      isActive: false,
    },
    {
      name: "Coming soon",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2026-04-10T16:00:00"),
      endsAt: null,
      isActive: true,
    },
    {
      name: "With ends",
      products: 2,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2026-05-01T08:00:00"),
      endsAt: new Date("2026-12-31T23:59:00"),
      isActive: true,
    },
  ];

  for (const data of preorders) {
    await prisma.preorder.create({ data });
  }

  console.log(`Seeded ${preorders.length} preorders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
