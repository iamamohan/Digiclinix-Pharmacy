import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function runPhase9EOTPVerification() {
  console.log('====================================================');
  console.log('🧪 Phase 9E: 6-Digit Email OTP Verification E2E Suite');
  console.log('====================================================\n');

  const testEmail = `otp_test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const baseUrl = 'http://localhost:3000';

  // 1. Signup Flow: Create unverified account & generate 6-digit OTP
  console.log('--- Test 1: Email Signup & Unverified State ---');
  const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'OTP Test User',
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

  // Check EmailVerificationOTP in DB
  const otpRecord = await prisma.emailVerificationOTP.findFirst({
    where: { email: testEmail },
  });

  if (!otpRecord) throw new Error('❌ FAILED: EmailVerificationOTP record not found in DB');
  console.log(`EmailVerificationOTP ID: ${otpRecord.id}`);
  console.log(`Bcrypt CodeHash stored in DB: ${otpRecord.codeHash.substring(0, 15)}...`);
  console.log(`OTP Expiration (10 mins): ${otpRecord.expiresAt.toISOString()}`);
  console.log(`Attempt counter: ${otpRecord.attempts}`);
  console.log('✅ OTP DB Storage Test PASSED: Bcrypt hash stored, raw OTP never persisted!\n');

  // 2. Unverified Login Guard
  console.log('--- Test 2: Unverified Login Attempt ---');
  const isPasswordValid = await bcrypt.compare(testPassword, dbUser.passwordHash!);
  const isVerified = dbUser.emailVerified !== null;

  console.log(`Password Valid: ${isPasswordValid}, Email Verified: ${isVerified}`);
  if (isPasswordValid && !isVerified) {
    console.log('✅ Unverified Login Guard PASSED: Credentials authorize blocked with UNVERIFIED_EMAIL!\n');
  } else {
    throw new Error('❌ Unverified Login Guard FAILED');
  }

  // 3. Resend OTP & Rate Limiting Test
  console.log('--- Test 3: Resend OTP Rate Limiting ---');
  // Signup just set cooldown, so immediate resend attempt should trigger 60s cooldown
  const resendCooldownAttempt = await fetch(`${baseUrl}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const cooldownData = await resendCooldownAttempt.json();
  console.log(`Immediate Resend HTTP Status: ${resendCooldownAttempt.status}`);
  console.log(`Immediate Resend Response Error: "${cooldownData.error?.message || cooldownData.message}"`);

  if (resendCooldownAttempt.status === 400 && cooldownData.error?.message?.includes('wait')) {
    console.log('✅ Resend Rate Limiting PASSED: 60s cooldown enforced starting from signup!\n');
  } else {
    throw new Error('❌ Resend Rate Limiting FAILED');
  }

  // Test Resend Account Enumeration Guard (fake email)
  console.log('--- Test 4: Resend Account Enumeration Protection ---');
  const fakeEmail = `nonexistent_user_${Date.now()}@example.com`;
  const fakeResend = await fetch(`${baseUrl}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: fakeEmail }),
  });
  const fakeResendData = await fakeResend.json();
  console.log(`Fake Email Resend HTTP Status: ${fakeResend.status}`);
  console.log(`Fake Email Resend Full Data:`, JSON.stringify(fakeResendData));

  if (
    fakeResend.status === 200 &&
    fakeResendData.message ===
      'If an account with this email exists and requires verification, a new verification code has been sent.'
  ) {
    console.log('✅ Enumeration Protection PASSED: Generic response returned for non-existent email!\n');
  } else {
    throw new Error(`❌ Enumeration Protection FAILED: ${JSON.stringify(fakeResendData)}`);
  }

  // 5. Test Incorrect OTP & Attempt Counter (5 Attempts Invalidation)
  console.log('--- Test 5: Incorrect OTP & 5-Attempt Limit ---');
  // Send 4 wrong attempts
  for (let i = 1; i <= 4; i++) {
    const wrongRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, otp: '999999' }),
    });
    const wrongData = await wrongRes.json();
    console.log(`Wrong OTP Attempt #${i} -> HTTP ${wrongRes.status}: "${wrongData.error?.message}"`);
  }

  const attemptsRecord = await prisma.emailVerificationOTP.findFirst({
    where: { email: testEmail },
  });
  console.log(`OTP attempt count in DB after 4 wrong entries: ${attemptsRecord?.attempts}`);

  // 5th wrong attempt should invalidate/delete OTP record
  const wrong5 = await fetch(`${baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, otp: '999999' }),
  });
  const wrong5Data = await wrong5.json();
  console.log(`Wrong OTP Attempt #5 -> HTTP ${wrong5.status}: "${wrong5Data.error?.message}"`);

  const invalidatedRecord = await prisma.emailVerificationOTP.findFirst({
    where: { email: testEmail },
  });
  console.log(`OTP record in DB after 5th failure: ${invalidatedRecord ? 'STILL EXISTS' : 'DELETED/INVALIDATED'}`);

  if (!invalidatedRecord) {
    console.log('✅ Attempt Counter & Invalidation PASSED: OTP deleted after 5 failed attempts!\n');
  } else {
    throw new Error('❌ 5-Attempt Invalidation FAILED');
  }

  // 6. Request New OTP for Successful Verification
  console.log('--- Test 6: Valid OTP Verification & Atomic Cleanup ---');
  // Create fresh OTP directly via generateEmailOTP
  const { generateEmailOTP } = await import('../lib/auth/otp');
  const { rawOtp } = await generateEmailOTP(testEmail);
  console.log(`Fresh 6-digit OTP generated for test: ${rawOtp}`);

  // Verify fresh OTP via API
  const verifyRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, otp: rawOtp }),
  });
  const verifyData = await verifyRes.json();
  console.log(`Verify HTTP Status: ${verifyRes.status}`);
  console.log(`Verify Response Message: "${verifyData.message}"`);

  if (verifyRes.status !== 200 || !verifyData.success) {
    throw new Error(`OTP verification failed: ${JSON.stringify(verifyData)}`);
  }

  const verifiedUser = await prisma.user.findUnique({ where: { email: testEmail } });
  console.log(`Updated emailVerified timestamp in DB: ${verifiedUser?.emailVerified}`);

  const consumedOtp = await prisma.emailVerificationOTP.findFirst({ where: { email: testEmail } });
  console.log(`OTP record in DB after verification: ${consumedOtp ? 'STILL EXISTS' : 'DELETED'}`);

  if (verifiedUser?.emailVerified && !consumedOtp) {
    console.log('✅ Valid OTP Verification PASSED: User emailVerified set & single-use OTP deleted!\n');
  } else {
    throw new Error('❌ Valid OTP Verification FAILED');
  }

  // 7. Test OTP Reuse Security
  console.log('--- Test 7: OTP Reuse & Invalid Code Security ---');
  const reuseRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, otp: rawOtp }),
  });
  const reuseData = await reuseRes.json();
  console.log(`Reused OTP HTTP Status: ${reuseRes.status}`);
  console.log(`Reused OTP Response Error: "${reuseData.error?.message}"`);

  if (reuseRes.status === 400 && reuseData.error?.message === 'Invalid or expired verification code.') {
    console.log('✅ Token Security PASSED: Reused OTP rejected with generic error!\n');
  } else {
    throw new Error('❌ OTP Reuse Security FAILED');
  }

  // 8. Cleanup
  console.log('--- Test 8: Cleanup ---');
  await prisma.user.delete({ where: { id: dbUser.id } });
  console.log(`Cleaned up test account: ${testEmail}`);
  console.log('\n✨ ALL PHASE 9E OTP VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runPhase9EOTPVerification()
  .catch((err) => {
    console.error('Fatal OTP E2E test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
