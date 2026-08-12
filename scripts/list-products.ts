import { prisma } from '../lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, category: true },
    orderBy: { name: 'asc' },
  });
  products.forEach((p) => {
    console.log(`${p.id} | ${p.name} | ${p.category} | ${p.slug}`);
  });
}

main().finally(() => prisma.$disconnect());
