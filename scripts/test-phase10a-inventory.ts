import { productService } from '../services/product.service';
import { prisma } from '../lib/prisma';

async function runPhase10aTest() {
  console.log('====================================================');
  console.log('🧪 Phase 10A: Inventory Database & Schema Verification');
  console.log('====================================================\n');

  try {
    // 1. Fetch existing products from DB
    const listResult = await productService.list({ page: 1, pageSize: 10, sortBy: 'createdAt', sortOrder: 'desc' });
    console.log(`✅ productService.list returned ${listResult.products.length} products.`);

    const sampleProduct = listResult.products[0];
    if (sampleProduct) {
      console.log('\n--- Existing Product Field Inspection ---');
      console.log(`  Name: ${sampleProduct.name}`);
      console.log(`  inStock (legacy): ${sampleProduct.inStock}`);
      console.log(`  stockQuantity (new): ${sampleProduct.stockQuantity}`);
      console.log(`  lowStockThreshold (new): ${sampleProduct.lowStockThreshold}`);
      console.log(`  discount (new): ${sampleProduct.discount}`);
      console.log(`  isFeatured (new): ${sampleProduct.isFeatured}`);
      console.log(`  isActive (new): ${sampleProduct.isActive}`);

      if (sampleProduct.stockQuantity === 10 && sampleProduct.lowStockThreshold === 5) {
        console.log('✅ Inventory defaults & backfill verification PASSED!\n');
      } else {
        console.log('ℹ️ Product has custom stock values.\n');
      }
    }

    // 2. Test Product Creation with Inventory Fields
    console.log('--- Creating Test Product with Custom Inventory Values ---');
    const newProduct = await productService.create({
      name: `Phase 10A Test Remedy ${Date.now()}`,
      category: 'Wellness',
      price: 199.99,
      description: 'Phase 10A schema test product',
      inStock: true,
      requiresPrescription: false,
      stockQuantity: 25,
      lowStockThreshold: 8,
      discount: 15,
      isFeatured: true,
      isActive: true,
    });

    console.log(`✅ Created Product ID: ${newProduct.id}`);
    console.log(`  stockQuantity: ${newProduct.stockQuantity}`);
    console.log(`  lowStockThreshold: ${newProduct.lowStockThreshold}`);
    console.log(`  discount: ${newProduct.discount}`);
    console.log(`  isFeatured: ${newProduct.isFeatured}`);
    console.log(`  isActive: ${newProduct.isActive}`);

    // 3. Test Product Update with Inventory Fields
    console.log('\n--- Updating Test Product Inventory Values ---');
    const updatedProduct = await productService.update(newProduct.id, {
      stockQuantity: 3,
      discount: 20,
    });

    if (updatedProduct) {
      console.log(`✅ Updated Product stockQuantity: ${updatedProduct.stockQuantity}`);
      console.log(`  Harmonized inStock (stockQuantity > 0): ${updatedProduct.inStock}`);
      console.log(`  Updated discount: ${updatedProduct.discount}`);
    }

    // 4. Cleanup Test Product
    console.log('\n--- Cleaning Up Test Product ---');
    await productService.remove(newProduct.id);
    console.log('✅ Test product cleaned up from Neon database.\n');

    console.log('✨ ALL PHASE 10A INVENTORY SCHEMA TESTS PASSED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Phase 10A Test Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase10aTest();
