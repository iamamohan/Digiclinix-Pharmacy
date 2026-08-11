import { prisma } from '../lib/prisma';
import { orderService } from '../services/order.service';

async function testPhase10DOrders() {
  console.log('\n====================================================');
  console.log('🧪 Phase 10D: Checkout & Order Management Verification');
  console.log('====================================================\n');

  // 1. Setup Test User & Products
  const testUser = await prisma.user.findFirst({
    where: { email: 'mohan.test@digiclinix.com' },
  });

  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!testUser || !adminUser) {
    throw new Error('Test user or admin user not found in database.');
  }

  // Create Active Test Product A
  const productA = await prisma.product.create({
    data: {
      name: 'Phase 10D Test Supplement 500mg',
      slug: `phase-10d-product-a-${Date.now()}`,
      category: 'Supplements',
      price: 100,
      discount: 10, // 10% OFF => unitPrice = 90
      stockQuantity: 10,
      inStock: true,
      isActive: true,
      requiresPrescription: false,
    },
  });

  // Create Inactive Test Product B
  const productInactive = await prisma.product.create({
    data: {
      name: 'Phase 10D Inactive Drug',
      slug: `phase-10d-inactive-${Date.now()}`,
      category: 'Specialty',
      price: 50,
      stockQuantity: 20,
      inStock: true,
      isActive: false,
      requiresPrescription: false,
    },
  });

  // Create Rx Test Product C
  const productRx = await prisma.product.create({
    data: {
      name: 'Phase 10D Prescription Drug',
      slug: `phase-10d-rx-${Date.now()}`,
      category: 'Rx',
      price: 200,
      stockQuantity: 15,
      inStock: true,
      isActive: true,
      requiresPrescription: true,
    },
  });

  console.log('✅ Created 3 test products (Active, Inactive, Prescription).');

  try {
    // 2. Test Empty Cart Rejection
    try {
      await orderService.createOrder(testUser.id, {
        shippingName: 'Test Customer',
        shippingPhone: '555-1234',
        shippingAddress: '123 Test St',
        shippingCity: 'City',
        shippingState: 'ST',
        shippingPostalCode: '12345',
        items: [],
      });
      console.error('❌ Failed: Empty cart was not rejected.');
    } catch (e: any) {
      console.log('✅ Empty cart correctly rejected:', e.message);
    }

    // 3. Test Inactive Product Rejection
    try {
      await orderService.createOrder(testUser.id, {
        shippingName: 'Test Customer',
        shippingPhone: '555-1234',
        shippingAddress: '123 Test St',
        shippingCity: 'City',
        shippingState: 'ST',
        shippingPostalCode: '12345',
        items: [{ productId: productInactive.id, quantity: 1 }],
      });
      console.error('❌ Failed: Inactive product was not rejected.');
    } catch (e: any) {
      console.log('✅ Inactive product correctly rejected:', e.message);
    }

    // 4. Test Prescription Medication Rejection
    try {
      await orderService.createOrder(testUser.id, {
        shippingName: 'Test Customer',
        shippingPhone: '555-1234',
        shippingAddress: '123 Test St',
        shippingCity: 'City',
        shippingState: 'ST',
        shippingPostalCode: '12345',
        items: [{ productId: productRx.id, quantity: 1 }],
      });
      console.error('❌ Failed: Prescription product was not rejected.');
    } catch (e: any) {
      console.log('✅ Prescription product correctly rejected:', e.message);
    }

    // 5. Test Insufficient Stock Rejection
    try {
      await orderService.createOrder(testUser.id, {
        shippingName: 'Test Customer',
        shippingPhone: '555-1234',
        shippingAddress: '123 Test St',
        shippingCity: 'City',
        shippingState: 'ST',
        shippingPostalCode: '12345',
        items: [{ productId: productA.id, quantity: 15 }], // Stock is 10
      });
      console.error('❌ Failed: Insufficient stock was not rejected.');
    } catch (e: any) {
      console.log('✅ Insufficient stock correctly rejected:', e.message);
    }

    // 6. Test Successful Order Creation & Server-Authoritative Totals
    const idempotencyToken = `test-idempotency-${Date.now()}`;
    const order1 = await orderService.createOrder(testUser.id, {
      idempotencyKey: idempotencyToken,
      shippingName: 'John Doe',
      shippingPhone: '555-9999',
      shippingAddress: '456 Order Ln',
      shippingCity: 'Springfield',
      shippingState: 'IL',
      shippingPostalCode: '62701',
      items: [
        { productId: productA.id, quantity: 2 },
        { productId: productA.id, quantity: 1 }, // Tests item normalization (2 + 1 = 3)
      ],
    });

    console.log('\n--- Order Created Successfully ---');
    console.log('  Order ID     :', order1.id);
    console.log('  Order Number :', order1.orderNumber);
    console.log('  Subtotal     :', String(order1.subtotal)); // 3 * 100 = 300
    console.log('  Discount     :', String(order1.discount)); // 3 * 10 = 30
    console.log('  Total        :', String(order1.total));    // 300 - 30 = 270

    if (Number(order1.total) !== 270) {
      throw new Error(`Total calculation error. Expected 270, got ${order1.total}`);
    }
    console.log('✅ Server-authoritative totals & item normalization PASSED!');

    // 7. Verify Atomic Stock Deduction
    const updatedProductA = await prisma.product.findUnique({ where: { id: productA.id } });
    console.log('  Product A Initial Stock : 10');
    console.log('  Product A New Stock     :', updatedProductA?.stockQuantity);
    console.log('  Product A inStock       :', updatedProductA?.inStock);

    if (updatedProductA?.stockQuantity !== 7) {
      throw new Error(`Stock deduction error. Expected 7, got ${updatedProductA?.stockQuantity}`);
    }
    console.log('✅ Atomic stock deduction & inStock sync PASSED!');

    // 8. Test Idempotency (Same user + same key returns same order)
    const duplicateOrder = await orderService.createOrder(testUser.id, {
      idempotencyKey: idempotencyToken,
      shippingName: 'John Doe',
      shippingPhone: '555-9999',
      shippingAddress: '456 Order Ln',
      shippingCity: 'Springfield',
      shippingState: 'IL',
      shippingPostalCode: '62701',
      items: [{ productId: productA.id, quantity: 1 }],
    });

    if (duplicateOrder.id !== order1.id) {
      throw new Error('Idempotency check failed. Created a new order instead of returning existing.');
    }
    console.log('✅ User-scoped idempotency check PASSED!');

    // 9. Test Ownership Access Control
    const fetchedUserOrder = await orderService.getOrderById(order1.id, testUser.id, false);
    if (!fetchedUserOrder) throw new Error('Customer failed to read own order.');

    try {
      await orderService.getOrderById(order1.id, 'unauthorized-user-id', false);
      console.error('❌ Failed: Unauthorized user was able to read another user order.');
    } catch (e: any) {
      console.log('✅ Ownership protection correctly blocked unauthorized user:', e.message);
    }

    const fetchedAdminOrder = await orderService.getOrderById(order1.id, adminUser.id, true);
    if (!fetchedAdminOrder) throw new Error('Admin failed to read order.');
    console.log('✅ Admin cross-access PASSED!');

    // 10. Test Status State Machine & Order Cancellation Stock Restoration
    console.log('\n--- Testing Status State Machine & Cancellation ---');

    // PENDING -> CONFIRMED
    const orderConfirmed = await orderService.updateOrderStatus(order1.id, 'CONFIRMED', true);
    console.log('  Updated Status -> CONFIRMED:', orderConfirmed?.status);

    // Invalid transition: CONFIRMED -> DELIVERED (should fail)
    try {
      await orderService.updateOrderStatus(order1.id, 'DELIVERED', true);
      console.error('❌ Failed: Invalid status jump was allowed.');
    } catch (e: any) {
      console.log('✅ Invalid status transition correctly rejected:', e.message);
    }

    // CONFIRMED -> CANCELLED (Restores stock from 7 back to 10)
    const orderCancelled = await orderService.updateOrderStatus(order1.id, 'CANCELLED', true);
    console.log('  Updated Status -> CANCELLED:', orderCancelled?.status);

    const restoredProductA = await prisma.product.findUnique({ where: { id: productA.id } });
    console.log('  Product A Restored Stock:', restoredProductA?.stockQuantity);

    if (restoredProductA?.stockQuantity !== 10) {
      throw new Error(`Stock restoration error. Expected 10, got ${restoredProductA?.stockQuantity}`);
    }
    console.log('✅ Cancellation stock restoration PASSED!');

    // Test Double Cancellation Protection (Should fail gracefully without double restoration)
    try {
      await orderService.updateOrderStatus(order1.id, 'CANCELLED', true);
      console.error('❌ Failed: Double cancellation was permitted.');
    } catch (e: any) {
      console.log('✅ Double cancellation correctly blocked:', e.message);
    }

    const postDoubleRestoredProductA = await prisma.product.findUnique({ where: { id: productA.id } });
    if (postDoubleRestoredProductA?.stockQuantity !== 10) {
      throw new Error('Double restoration bug! Stock increased twice.');
    }
    console.log('✅ Double restoration protection PASSED!');
  } finally {
    // Clean up test data
    await prisma.product.deleteMany({
      where: {
        id: { in: [productA.id, productInactive.id, productRx.id] },
      },
    });
    console.log('\n✅ Cleaned up test data.');
  }

  console.log('\n====================================================');
  console.log('✨ ALL PHASE 10D ORDER & STOCK TESTS PASSED!');
  console.log('====================================================\n');
}

testPhase10DOrders()
  .catch((err) => {
    console.error('\n❌ Phase 10D Test Script Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
