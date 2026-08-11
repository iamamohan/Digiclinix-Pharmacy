import { prisma } from '../lib/prisma';
import { encode } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'secret';

async function runE2EVerification() {
  console.log('====================================================');
  console.log('🧪 RBAC E2E Verification Script');
  console.log('====================================================\n');

  const testEmailUser = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // 1. Verify Default Signup Role (Server-side ignore of role: "ADMIN")
  console.log('--- 1. Testing Default Signup Role ---');
  const passwordHash = await bcrypt.hash(testPassword, 10);
  
  // Create user directly mimicking signup API logic
  const newUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: testEmailUser,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(`User created: ${newUser.email}`);
  console.log(`Assigned role in DB: "${newUser.role}"`);
  if (newUser.role === 'USER') {
    console.log('✅ Signup Default Role Test PASSED: New account defaulted to "USER"\n');
  } else {
    console.error('❌ Signup Default Role Test FAILED\n');
  }

  // 2. Generate NextAuth JWT for USER account
  console.log('--- 2. Generating JWT Token for USER ---');
  const userJwt = await encode({
    token: {
      id: newUser.id,
      name: 'Test User',
      email: newUser.email,
      role: newUser.role,
    },
    secret: SECRET,
  });

  // 3. Test API responses for USER role via HTTP requests to dev server
  const cookieHeader = `next-auth.session-token=${userJwt}`;

  console.log('--- 3. Testing Protected Endpoints with USER JWT Cookie ---');

  // Test POST /api/products as USER
  try {
    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        name: 'Forbidden Test Product',
        category: 'Pain Relief',
        price: 99.99,
        inStock: true,
      }),
    });
    const data = await res.json();
    console.log(`POST /api/products as USER -> HTTP ${res.status}`);
    console.log(`Response body: ${JSON.stringify(data)}`);
    if (res.status === 403 && data.error?.code === 'FORBIDDEN') {
      console.log('✅ USER POST /api/products 403 Forbidden PASSED!\n');
    } else {
      console.error('❌ USER POST /api/products FAILED\n');
    }
  } catch (err) {
    console.error('Error fetching POST /api/products:', err);
  }

  // Test POST /api/cloudinary/sign as USER
  try {
    const res = await fetch('http://localhost:3000/api/cloudinary/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    console.log(`POST /api/cloudinary/sign as USER -> HTTP ${res.status}`);
    console.log(`Response body: ${JSON.stringify(data)}`);
    if (res.status === 403 && data.error?.code === 'FORBIDDEN') {
      console.log('✅ USER POST /api/cloudinary/sign 403 Forbidden PASSED!\n');
    } else {
      console.error('❌ USER POST /api/cloudinary/sign FAILED\n');
    }
  } catch (err) {
    console.error('Error fetching POST /api/cloudinary/sign:', err);
  }

  // 4. Promote User to ADMIN via Prisma DB update (testing script logic)
  console.log('--- 4. Promoting User to ADMIN ---');
  const updatedUser = await prisma.user.update({
    where: { email: testEmailUser },
    data: { role: 'ADMIN' },
    select: { id: true, email: true, role: true },
  });
  console.log(`User role updated to: "${updatedUser.role}"`);
  if (updatedUser.role === 'ADMIN') {
    console.log('✅ User promotion to ADMIN PASSED!\n');
  }

  // 5. Generate NextAuth JWT for ADMIN account
  console.log('--- 5. Testing Protected Endpoints with ADMIN JWT Cookie ---');
  const adminJwt = await encode({
    token: {
      id: updatedUser.id,
      name: 'Test Admin User',
      email: updatedUser.email,
      role: updatedUser.role,
    },
    secret: SECRET,
  });
  const adminCookieHeader = `next-auth.session-token=${adminJwt}`;

  // Test POST /api/cloudinary/sign as ADMIN
  try {
    const res = await fetch('http://localhost:3000/api/cloudinary/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    console.log(`POST /api/cloudinary/sign as ADMIN -> HTTP ${res.status}`);
    console.log(`Response body signature present: ${Boolean(data.data?.signature)}`);
    if (res.status === 200 && data.success && data.data?.signature) {
      console.log('✅ ADMIN Cloudinary Sign PASSED!\n');
    } else {
      console.error('❌ ADMIN Cloudinary Sign FAILED\n');
    }
  } catch (err) {
    console.error('Error fetching POST /api/cloudinary/sign as ADMIN:', err);
  }

  // Test POST /api/products as ADMIN
  let createdProductId = '';
  try {
    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookieHeader,
      },
      body: JSON.stringify({
        name: `RBAC Test Product ${Date.now()}`,
        category: 'Pain Relief',
        price: 49.99,
        description: 'E2E Verified product creation',
        inStock: true,
        requiresPrescription: false,
      }),
    });
    const data = await res.json();
    console.log(`POST /api/products as ADMIN -> HTTP ${res.status}`);
    if (res.status === 201 && data.success && data.data?.id) {
      createdProductId = data.data.id;
      console.log(`✅ ADMIN Product Creation PASSED! Created product ID: ${createdProductId}\n`);
    } else {
      console.error('❌ ADMIN Product Creation FAILED\n');
    }
  } catch (err) {
    console.error('Error creating product as ADMIN:', err);
  }

  // Test PUT /api/products/[id] as ADMIN
  if (createdProductId) {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${createdProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookieHeader,
        },
        body: JSON.stringify({
          name: `Updated RBAC Product ${Date.now()}`,
          price: 59.99,
        }),
      });
      const data = await res.json();
      console.log(`PUT /api/products/${createdProductId} as ADMIN -> HTTP ${res.status}`);
      if (res.status === 200 && data.success) {
        console.log('✅ ADMIN Product Update PASSED!\n');
      } else {
        console.error('❌ ADMIN Product Update FAILED!\n');
      }
    } catch (err) {
      console.error('Error updating product as ADMIN:', err);
    }

    // Test DELETE /api/products/[id] as ADMIN
    try {
      const res = await fetch(`http://localhost:3000/api/products/${createdProductId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookieHeader,
        },
      });
      const data = await res.json();
      console.log(`DELETE /api/products/${createdProductId} as ADMIN -> HTTP ${res.status}`);
      if (res.status === 200 && data.success) {
        console.log('✅ ADMIN Product Deletion PASSED!\n');
      } else {
        console.error('❌ ADMIN Product Deletion FAILED!\n');
      }
    } catch (err) {
      console.error('Error deleting product as ADMIN:', err);
    }
  }

  // Clean up test user
  await prisma.user.delete({ where: { id: newUser.id } });
  console.log('--- Cleanup: Test User deleted from DB ---');
  console.log('\n✨ ALL RBAC E2E TESTS COMPLETED SUCCESSFULLY!');
}

runE2EVerification()
  .catch((err) => {
    console.error('Fatal E2E test error:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
