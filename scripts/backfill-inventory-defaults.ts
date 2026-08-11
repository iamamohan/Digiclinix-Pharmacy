import { prisma } from '../lib/prisma';

async function backfillInventoryDefaults() {
  console.log('====================================================');
  console.log('📦 Phase 10A: Backfilling Inventory Defaults');
  console.log('====================================================\n');

  try {
    const products = await prisma.product.findMany({});
    console.log(`Found ${products.length} existing products in Neon database.\n`);

    let updatedCount = 0;

    for (const product of products) {
      // Preserve availability semantics:
      // If product was inStock === true, set initial stockQuantity = 10
      // If product was inStock === false, set initial stockQuantity = 0
      const targetStockQuantity = product.inStock ? 10 : 0;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: targetStockQuantity,
          lowStockThreshold: 5,
          discount: 0,
          isFeatured: false,
          isActive: true,
        },
      });

      console.log(
        `  ✓ Product: "${product.name}" (${product.id}) | inStock: ${product.inStock} -> stockQuantity set to ${targetStockQuantity}`
      );
      updatedCount++;
    }

    console.log(`\n✨ Backfill completed successfully! Updated ${updatedCount} products.\n`);
  } catch (error) {
    console.error('❌ Error during inventory backfill:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backfillInventoryDefaults();
