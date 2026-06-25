import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const preorders = [
    {
      name: "iPhone 18 Pro Preorder",
      products: 8,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2026-07-01T09:00:00"),
      endsAt: new Date("2026-09-01T09:00:00"),
      isActive: true,
    },
    {
      name: "Samsung Galaxy Ultra",
      products: 5,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2026-08-10T10:00:00"),
      endsAt: null,
      isActive: true,
    },
    {
      name: "Gaming Laptop Launch",
      products: 3,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2026-06-15T12:00:00"),
      endsAt: null,
      isActive: false,
    },
    {
      name: "Smart Watch Edition",
      products: 10,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2026-09-05T08:00:00"),
      endsAt: new Date("2027-01-05T08:00:00"),
      isActive: true,
    },
    {
      name: "Wireless Earbuds",
      products: 6,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2026-10-20T14:30:00"),
      endsAt: null,
      isActive: true,
    },
    {
      name: "Premium Tablet",
      products: 4,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2026-11-01T00:00:00"),
      endsAt: new Date("2027-03-01T00:00:00"),
      isActive: false,
    },
    {
      name: "Next Gen Console",
      products: 12,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2026-12-10T16:00:00"),
      endsAt: null,
      isActive: true,
    },
    {
      name: "Limited Collector Edition",
      products: 2,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2027-01-01T08:00:00"),
      endsAt: new Date("2027-06-30T23:59:00"),
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