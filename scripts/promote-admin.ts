/**
 * ============================================================
 * Digiclinix Pharmacy — Admin Promotion Script
 * ============================================================
 *
 * PURPOSE:
 *   Safely promotes an existing user account to ADMIN role.
 *   This script runs server-side only (never exposed to the browser).
 *
 * USAGE:
 *   1. Set ADMIN_EMAIL environment variable to the target account email:
 *
 *      On Windows PowerShell:
 *        $env:ADMIN_EMAIL="your-trusted-email@example.com"; npx tsx scripts/promote-admin.ts
 *
 *      On Linux/macOS:
 *        ADMIN_EMAIL=your-trusted-email@example.com npx tsx scripts/promote-admin.ts
 *
 *   2. Confirm the operation when prompted.
 *
 * SECURITY:
 *   - Only runs when invoked explicitly via CLI
 *   - Never accepts email from URL parameters or HTTP requests
 *   - Reads from DATABASE_URL environment variable (same as app)
 *   - Does not expose or log any secrets
 *   - Does not affect any other users
 *   - Does not delete any data
 *
 * REQUIREMENTS:
 *   - The target email must already have a registered account
 *   - Run from the project root directory
 * ============================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin() {
  const targetEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

  if (!targetEmail) {
    console.error('\n❌ Error: ADMIN_EMAIL environment variable is not set.\n');
    console.error('Usage:');
    console.error('  Windows PowerShell:');
    console.error('    $env:ADMIN_EMAIL="your-email@example.com"; npx tsx scripts/promote-admin.ts\n');
    console.error('  Linux/macOS:');
    console.error('    ADMIN_EMAIL=your-email@example.com npx tsx scripts/promote-admin.ts\n');
    process.exit(1);
  }

  console.log('\n🔐 Digiclinix Pharmacy — Admin Promotion Script');
  console.log('═══════════════════════════════════════════════');
  console.log(`Target email: ${targetEmail}`);

  // Look up the user
  const user = await prisma.user.findUnique({
    where: { email: targetEmail },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    console.error(`\n❌ No user found with email: ${targetEmail}`);
    console.error('   The user must register an account first before being promoted.\n');
    process.exit(1);
  }

  if (user.role === 'ADMIN') {
    console.log(`\n✅ User "${user.name || user.email}" is already an ADMIN. No changes needed.\n`);
    process.exit(0);
  }

  console.log(`\nFound user:`);
  console.log(`  Name    : ${user.name || '(no name)'}`);
  console.log(`  Email   : ${user.email}`);
  console.log(`  Role    : ${user.role}`);
  console.log(`  Member  : ${user.createdAt.toLocaleDateString()}`);
  console.log('\nPromoting to ADMIN...');

  await prisma.user.update({
    where: { email: targetEmail },
    data: { role: 'ADMIN' },
  });

  console.log('\n✅ Success! User has been promoted to ADMIN.');
  console.log('   The user must sign out and sign back in for the new role to take effect.');
  console.log('   (JWT tokens are refreshed on sign-in.)\n');
}

promoteToAdmin()
  .catch((error) => {
    console.error('\n❌ Unexpected error during admin promotion:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
