import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Digiclinix Pharmacy products...');

  const products = [
    {
      name: 'Paracetamol 500mg Tablets',
      slug: 'paracetamol-500mg-tablets',
      category: 'Pain Relief',
      price: 49.99,
      description: 'Effective pain relief and fever reduction. Suitable for adults and children over 12.',
      imageUrl: '/images/products/paracetamol.png',
      inStock: true,
      requiresPrescription: false,
    },
    {
      name: 'Amoxicillin 250mg Capsules',
      slug: 'amoxicillin-250mg-capsules',
      category: 'Antibiotics',
      price: 129.50,
      description: 'Broad-spectrum antibiotic for treating bacterial infections.',
      imageUrl: '/images/products/amoxicillin.png',
      inStock: true,
      requiresPrescription: true,
    },
    {
      name: 'Vitamin D3 1000IU Softgels',
      slug: 'vitamin-d3-1000iu-softgels',
      category: 'Vitamins & Supplements',
      price: 299.00,
      description: 'Essential Vitamin D3 supplement for bone health and immune system support.',
      imageUrl: '/images/products/vitamin-d3.png',
      inStock: true,
      requiresPrescription: false,
    },
    {
      name: 'Omeprazole 20mg Capsules',
      slug: 'omeprazole-20mg-capsules',
      category: 'Digestive Health',
      price: 89.00,
      description: 'Proton pump inhibitor for treating acid reflux, heartburn, and stomach ulcers.',
      imageUrl: '/images/products/omeprazole.png',
      inStock: true,
      requiresPrescription: true,
    },
    {
      name: 'Cetirizine 10mg Tablets',
      slug: 'cetirizine-10mg-tablets',
      category: 'Allergy Relief',
      price: 64.00,
      description: 'Non-drowsy antihistamine for relief from hayfever, allergies, and urticaria.',
      imageUrl: '/images/products/cetirizine.png',
      inStock: false,
      requiresPrescription: false,
    },
    {
      name: 'Metformin 500mg Tablets',
      slug: 'metformin-500mg-tablets',
      category: 'Diabetes Care',
      price: 75.50,
      description: 'First-line oral medication for managing type 2 diabetes.',
      imageUrl: '/images/products/metformin.png',
      inStock: true,
      requiresPrescription: true,
    },
  ];

  let seededCount = 0;

  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: { imageUrl: product.imageUrl },
        create: product,
      });
      seededCount++;
      console.log(`  ✓ ${product.name}`);
    } catch (err) {
      console.error(`  ✗ Failed to seed ${product.name}:`, err);
    }
  }

  console.log(`\n✅ Seeded ${seededCount}/${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
