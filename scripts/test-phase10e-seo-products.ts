import { prisma } from '../lib/prisma';
import { productService } from '../services/product.service';
import { generateProductMetadata, generateProductJsonLd, getCanonicalProductUrl, SITE_URL } from '../lib/utils/seo';
import { convertFromINR, mapCountryToCurrency } from '../lib/utils/currency';
import sitemap from '../app/sitemap';

async function runPhase10ETests() {
  console.log('🧪 Starting Phase 10E — SEO, Medical Info & Currency Automated Test Suite...\n');

  let passedCount = 0;
  let testProductSlug = `test-seo-med-${Date.now()}`;
  let createdProductId: string | null = null;

  try {
    // 1. Create a test product with Medical & SEO fields
    console.log('--- 1. Testing Product Creation with Medical & SEO Fields ---');
    const created = await productService.create({
      name: 'Test SEO Paracetamol 650mg',
      slug: testProductSlug,
      category: 'Pain Relief',
      price: 150.0,
      description: 'High strength pain relief tablets for testing.',
      inStock: true,
      requiresPrescription: false,
      stockQuantity: 25,
      lowStockThreshold: 5,
      discount: 10,
      isFeatured: true,
      isActive: true,
      uses: 'Relief of severe fever and post-operative pain.',
      warnings: 'Do not consume with alcohol or other paracetamol products.',
      seoTitle: 'Buy Test Paracetamol 650mg | Digiclinix Online',
      seoDescription: 'Order Test Paracetamol 650mg online with fast delivery at Digiclinix.',
      seoKeywords: 'paracetamol, 650mg, pain relief, fever',
    });

    createdProductId = created.id;
    console.log(`✅ Test Product Created ID: ${created.id}`);

    // Assertion 1: getBySlug returns created product
    const fetchedBySlug = await productService.getBySlug(testProductSlug);
    if (fetchedBySlug && fetchedBySlug.id === created.id) {
      console.log('   Assertion 1 PASSED: Product resolved correctly by slug.');
      passedCount++;
    } else {
      throw new Error('Assertion 1 FAILED: Product slug lookup returned unexpected result.');
    }

    // Assertion 2: Invalid slug returns null
    const invalidSlugResult = await productService.getBySlug('non-existent-medicine-slug-999');
    if (invalidSlugResult === null) {
      console.log('   Assertion 2 PASSED: Invalid slug lookup correctly returned null.');
      passedCount++;
    } else {
      throw new Error('Assertion 2 FAILED: Invalid slug should return null.');
    }

    // Assertion 3: Medical 'uses' field stored and retrieved
    if (fetchedBySlug?.uses === 'Relief of severe fever and post-operative pain.') {
      console.log('   Assertion 3 PASSED: Medical "uses" field verified.');
      passedCount++;
    } else {
      throw new Error('Assertion 3 FAILED: "uses" field value mismatch.');
    }

    // Assertion 4: Medical 'warnings' field stored and retrieved
    if (fetchedBySlug?.warnings === 'Do not consume with alcohol or other paracetamol products.') {
      console.log('   Assertion 4 PASSED: Medical "warnings" field verified.');
      passedCount++;
    } else {
      throw new Error('Assertion 4 FAILED: "warnings" field value mismatch.');
    }

    console.log('\n--- 2. Testing Dynamic Metadata & OpenGraph Generators ---');
    // Assertion 5: Custom SEO Title resolution
    const metadata = generateProductMetadata(fetchedBySlug);
    if (metadata.title === 'Buy Test Paracetamol 650mg | Digiclinix Online') {
      console.log('   Assertion 5 PASSED: Custom SEO title resolved.');
      passedCount++;
    } else {
      throw new Error(`Assertion 5 FAILED: Expected custom SEO title, got "${metadata.title}"`);
    }

    // Assertion 6: Fallback SEO Title resolution when custom title is missing
    const productNoSeo = { ...fetchedBySlug, seoTitle: null };
    const fallbackMeta = generateProductMetadata(productNoSeo);
    if (fallbackMeta.title === 'Test SEO Paracetamol 650mg | Digiclinix Pharmacy') {
      console.log('   Assertion 6 PASSED: Fallback SEO title resolved.');
      passedCount++;
    } else {
      throw new Error(`Assertion 6 FAILED: Expected fallback SEO title, got "${fallbackMeta.title}"`);
    }

    // Assertion 7: Custom SEO Description resolution
    if (metadata.description === 'Order Test Paracetamol 650mg online with fast delivery at Digiclinix.') {
      console.log('   Assertion 7 PASSED: Custom SEO description resolved.');
      passedCount++;
    } else {
      throw new Error(`Assertion 7 FAILED: Expected custom SEO description, got "${metadata.description}"`);
    }

    // Assertion 8: Fallback SEO Description resolution when custom description is missing
    const fallbackDescMeta = generateProductMetadata({ ...fetchedBySlug, seoDescription: null });
    if (fallbackDescMeta.description === 'High strength pain relief tablets for testing.') {
      console.log('   Assertion 8 PASSED: Fallback SEO description resolved.');
      passedCount++;
    } else {
      throw new Error(`Assertion 8 FAILED: Expected fallback SEO description, got "${fallbackDescMeta.description}"`);
    }

    // Assertion 9: Canonical URL uses SITE_URL
    const canonical = getCanonicalProductUrl(testProductSlug);
    if (canonical === `${SITE_URL}/products/${testProductSlug}`) {
      console.log(`   Assertion 9 PASSED: Canonical URL matches SITE_URL (${canonical}).`);
      passedCount++;
    } else {
      throw new Error(`Assertion 9 FAILED: Canonical URL mismatch. Got ${canonical}`);
    }

    // Assertion 10: Active product returns index: true in robots metadata
    if (metadata.robots && typeof metadata.robots === 'object' && metadata.robots.index === true) {
      console.log('   Assertion 10 PASSED: Active product robots set to index: true.');
      passedCount++;
    } else {
      throw new Error('Assertion 10 FAILED: Active product should be indexable.');
    }

    // Assertion 11: Inactive product returns index: false in robots metadata
    const inactiveMeta = generateProductMetadata({ ...fetchedBySlug, isActive: false });
    if (inactiveMeta.robots && typeof inactiveMeta.robots === 'object' && inactiveMeta.robots.index === false) {
      console.log('   Assertion 11 PASSED: Inactive product robots set to index: false.');
      passedCount++;
    } else {
      throw new Error('Assertion 11 FAILED: Inactive product should be noindex.');
    }

    console.log('\n--- 3. Testing JSON-LD Structured Data ---');
    // Assertion 12: JSON-LD @type is Product
    const jsonLd = generateProductJsonLd(fetchedBySlug);
    if (jsonLd['@type'] === 'Product' && jsonLd.name === 'Test SEO Paracetamol 650mg') {
      console.log('   Assertion 12 PASSED: Product JSON-LD schema validated.');
      passedCount++;
    } else {
      throw new Error('Assertion 12 FAILED: JSON-LD schema invalid.');
    }

    // Assertion 13: JSON-LD availability is InStock when stock > 0
    if (jsonLd.offers.availability === 'https://schema.org/InStock') {
      console.log('   Assertion 13 PASSED: Stock > 0 maps to schema.org/InStock.');
      passedCount++;
    } else {
      throw new Error('Assertion 13 FAILED: Expected InStock for stock > 0.');
    }

    // Assertion 14: JSON-LD availability is OutOfStock when stock === 0
    const outOfStockJsonLd = generateProductJsonLd({ ...fetchedBySlug, stockQuantity: 0, inStock: false });
    if (outOfStockJsonLd.offers.availability === 'https://schema.org/OutOfStock') {
      console.log('   Assertion 14 PASSED: Stock === 0 maps to schema.org/OutOfStock.');
      passedCount++;
    } else {
      throw new Error('Assertion 14 FAILED: Expected OutOfStock for stock === 0.');
    }

    console.log('\n--- 4. Testing Dynamic Sitemap Generator ---');
    // Assertion 15: Sitemap includes active product URL
    const sitemapEntries = await sitemap();
    const productSitemapEntry = sitemapEntries.find((e) => e.url.endsWith(`/products/${testProductSlug}`));
    if (productSitemapEntry) {
      console.log('   Assertion 15 PASSED: Active product entry present in sitemap.');
      passedCount++;
    } else {
      throw new Error('Assertion 15 FAILED: Active product entry missing from sitemap.');
    }

    // Assertion 16: Sitemap excludes inactive product
    await productService.update(createdProductId, { isActive: false });
    const sitemapAfterInactive = await sitemap();
    const inactiveSitemapEntry = sitemapAfterInactive.find((e) => e.url.endsWith(`/products/${testProductSlug}`));
    if (!inactiveSitemapEntry) {
      console.log('   Assertion 16 PASSED: Inactive product correctly excluded from sitemap.');
      passedCount++;
    } else {
      throw new Error('Assertion 16 FAILED: Inactive product should not be in sitemap.');
    }
    // Re-enable active status for remaining tests
    await productService.update(createdProductId, { isActive: true });

    console.log('\n--- 5. Testing Localized Display Currency ---');
    // Assertion 17: Country mapping helper converts US to USD
    const usCurrency = mapCountryToCurrency('US');
    if (usCurrency === 'USD') {
      console.log('   Assertion 17 PASSED: Country US maps to USD.');
      passedCount++;
    } else {
      throw new Error(`Assertion 17 FAILED: Expected USD, got ${usCurrency}`);
    }

    // Assertion 18: Country mapping helper falls back to INR on unknown country
    const unknownCurrency = mapCountryToCurrency('ZZ');
    if (unknownCurrency === 'INR') {
      console.log('   Assertion 18 PASSED: Unknown country ZZ falls back to INR.');
      passedCount++;
    } else {
      throw new Error(`Assertion 18 FAILED: Expected INR, got ${unknownCurrency}`);
    }

    // Assertion 19: Currency conversion calculates and formats display price
    const converted = convertFromINR(100, 'USD');
    if (converted.convertedAmount > 0 && converted.formattedDisplay.includes('$')) {
      console.log(`   Assertion 19 PASSED: INR 100 converts to ${converted.formattedDisplay}.`);
      passedCount++;
    } else {
      throw new Error('Assertion 19 FAILED: Currency conversion calculation error.');
    }

    // Assertion 20: Base Product price in DB remains unchanged after conversion
    const freshFromDb = await productService.getById(createdProductId);
    if (freshFromDb && parseFloat(freshFromDb.price) === 150) {
      console.log('   Assertion 20 PASSED: Database price remains strictly untouched (150 INR).');
      passedCount++;
    } else {
      throw new Error(`Assertion 20 FAILED: Database price was modified! Got ${freshFromDb?.price}`);
    }

    console.log('\n--- 6. Testing Admin Fields Update & Safety ---');
    // Assertion 21: Admin can update medical and SEO fields
    const updated = await productService.update(createdProductId, {
      uses: 'Updated test medical uses',
      seoTitle: 'Updated SEO Title Test',
    });

    if (updated && updated.uses === 'Updated test medical uses' && updated.seoTitle === 'Updated SEO Title Test') {
      console.log('   Assertion 21 PASSED: Admin updated medical and SEO fields successfully.');
      passedCount++;
    } else {
      throw new Error('Assertion 21 FAILED: Could not update medical/SEO fields.');
    }

    // Assertion 22: Non-destructive test record cleanup
    await productService.remove(createdProductId);
    const postDeleteCheck = await productService.getById(createdProductId);
    if (postDeleteCheck === null) {
      console.log('   Assertion 22 PASSED: Test record cleanly removed from database.');
      passedCount++;
    } else {
      throw new Error('Assertion 22 FAILED: Test product cleanup failed.');
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`🎉 ALL ${passedCount} / 22 PHASE 10E E2E ASSERTIONS PASSED!`);
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error: any) {
    console.error('\n❌ PHASE 10E E2E TEST FAILED:', error.message);
    if (createdProductId) {
      console.log('Cleaning up temporary test product...');
      await productService.remove(createdProductId).catch(() => {});
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase10ETests();
