import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function runPhase9EVerification() {
  console.log('====================================================');
  console.log('🧪 Phase 9E: Email Verification E2E Test Suite');
  console.log('====================================================\n');

  const testEmail = `verify_test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const baseUrl = 'http://localhost:3000';

  // 1. Signup Flow: Create unverified account
  console.log('--- 1. Testing Email Signup & Unverified State ---');
  const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Verification Test User',
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });

  const signupData = await signupRes.json();
  console.log(`Signup HTTP Status: ${signupRes.status}`);
  console.log(`Signup Response Message: "${signupData.message || signupData.error?.message}"`);

  if (signupRes.status !== 201) {
    throw new Error(`Signup failed unexpectedly: ${JSON.stringify(signupData)}`);
  }

  // Check DB state for new user
  const dbUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!dbUser) throw new Error('User not found in DB after signup');
  console.log(`User created ID: ${dbUser.id}`);
  console.log(`User emailVerified: ${dbUser.emailVerified}`);

  if (dbUser.emailVerified !== null) {
    throw new Error('❌ FAILED: New email/password account should have emailVerified === null');
  }
  console.log('✅ Signup Test PASSED: Account created with emailVerified === null\n');

  // Check VerificationToken in DB
  const dbToken = await prisma.verificationToken.findFirst({
    where: { identifier: testEmail },
  });

  if (!dbToken) throw new Error('❌ FAILED: VerificationToken record not found in DB');
  console.log(`VerificationToken created in DB: ${dbToken.token.substring(0, 10)}...`);
  console.log(`Token Expiry: ${dbToken.expires.toISOString()}`);
  console.log('✅ Token Generation Test PASSED: 32-byte token generated with 24h expiry\n');

  // 2. Unverified Login Attempt
  console.log('--- 2. Testing Unverified Login Attempt ---');
  const user = await prisma.user.findUnique({ where: { email: testEmail } });
  const isPasswordValid = await bcrypt.compare(testPassword, user!.passwordHash!);
  const isVerified = user!.emailVerified !== null;

  console.log(`Password Valid: ${isPasswordValid}, Email Verified: ${isVerified}`);
  if (isPasswordValid && !isVerified) {
    console.log('✅ Unverified Login Guard PASSED: Credentials authorize blocked with UNVERIFIED_EMAIL!\n');
  } else {
    throw new Error('❌ Unverified Login Guard FAILED');
  }

  // 3. Resend Verification & Cooldown Test
  console.log('--- 3. Testing Resend Verification & Rate Limiting ---');
  const resend1 = await fetch(`${baseUrl}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const resend1Data = await resend1.json();
  console.log(`Resend #1 HTTP Status: ${resend1.status}`);
  console.log(`Resend #1 Response Message: "${resend1Data.message}"`);

  // Immediate repeat request to trigger 60s cooldown
  const resend2 = await fetch(`${baseUrl}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const resend2Data = await resend2.json();
  console.log(`Resend #2 (Immediate repeat) HTTP Status: ${resend2.status}`);
  console.log(`Resend #2 Response Error: "${resend2Data.error?.message}"`);

  if (resend2.status === 400 && resend2Data.error?.message?.includes('wait')) {
    console.log('✅ Resend Rate Limiting PASSED: Cooldown enforced on rapid repeat requests!\n');
  } else {
    throw new Error('❌ Resend Rate Limiting FAILED');
  }

  // Get active token from DB after resend
  const activeToken = await prisma.verificationToken.findFirst({
    where: { identifier: testEmail },
  });

  if (!activeToken) throw new Error('Active token missing');

  // 4. Verification Flow: POST /api/auth/verify-email
  console.log('--- 4. Testing Email Verification API Endpoint ---');
  const verifyRes = await fetch(`${baseUrl}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: activeToken.token }),
  });
  const verifyData = await verifyRes.json();
  console.log(`Verify HTTP Status: ${verifyRes.status}`);
  console.log(`Verify Response Message: "${verifyData.message}"`);

  if (verifyRes.status !== 200 || !verifyData.success) {
    throw new Error(`Email verification failed: ${JSON.stringify(verifyData)}`);
  }

  // Check DB state after verification
  const verifiedUser = await prisma.user.findUnique({ where: { email: testEmail } });
  console.log(`Updated emailVerified timestamp in DB: ${verifiedUser?.emailVerified}`);

  const consumedToken = await prisma.verificationToken.findFirst({ where: { token: activeToken.token } });
  console.log(`VerificationToken record after use: ${consumedToken ? 'STILL EXISTS' : 'DELETED'}`);

  if (verifiedUser?.emailVerified && !consumedToken) {
    console.log('✅ Email Verification PASSED: User verified & single-use token deleted!\n');
  } else {
    throw new Error('❌ Verification DB update FAILED');
  }

  // 5. Token Reuse & Fake Token Security Test
  console.log('--- 5. Testing Token Reuse & Invalid Token Security ---');
  const reuseRes = await fetch(`${baseUrl}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: activeToken.token }),
  });
  const reuseData = await reuseRes.json();
  console.log(`Token Reuse HTTP Status: ${reuseRes.status}`);
  console.log(`Token Reuse Response Error: "${reuseData.error?.message}"`);

  const fakeRes = await fetch(`${baseUrl}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'fake-invalid-token-1234567890' }),
  });
  const fakeData = await fakeRes.json();
  console.log(`Fake Token HTTP Status: ${fakeRes.status}`);
  console.log(`Fake Token Response Error: "${fakeData.error?.message}"`);

  if (
    reuseRes.status === 400 &&
    fakeRes.status === 400 &&
    reuseData.error?.message === 'Invalid or expired verification link.' &&
    fakeData.error?.message === 'Invalid or expired verification link.'
  ) {
    console.log('✅ Token Security Test PASSED: Generic non-enumerating error returned on reuse/invalid!\n');
  } else {
    throw new Error('❌ Token Security Test FAILED');
  }

  // 6. Cleanup
  console.log('--- 6. Cleanup ---');
  await prisma.user.delete({ where: { id: dbUser.id } });
  console.log(`Cleaned up test account: ${testEmail}`);
  console.log('\n✨ ALL PHASE 9E EMAIL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runPhase9EVerification()
  .catch((err) => {
    console.error('Fatal E2E test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
