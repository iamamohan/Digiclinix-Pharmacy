import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { User, Mail, Calendar, ShieldCheck, KeyRound, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';

export const metadata: Metadata = {
  title: 'My Account | Digiclinix Pharmacy',
  description: 'Manage your Digiclinix Pharmacy profile and healthcare account details.',
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/account');
  }

  // Fetch user record and account relations from Neon database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Determine provider via relations
  const hasGoogleAccount = user.accounts.some((acc) => acc.provider === 'google');
  const providerLabel = hasGoogleAccount
    ? 'Google Account'
    : user.passwordHash
    ? 'Email & Password'
    : 'Digiclinix Account';

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const userEmail = user.email || session.user.email;
  const displayName = user.name || userEmail.split('@')[0];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="py-12 md:py-20 bg-slate-50/60 dark:bg-slate-950/40 min-h-[calc(100vh-4.5rem)]">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Account Overview
            </span>
            <h1 className="text-3xl font-extrabold font-manrope text-slate-900 dark:text-white mt-1">
              My Profile & Preferences
            </h1>
          </div>

          {/* User Profile Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-6">
            {/* Avatar & Name Header */}
            <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 dark:border-slate-800/80 pb-6 text-center sm:text-left">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-purple-600 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-purple-400 shrink-0 shadow-md">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-manrope">
                    {displayName}
                  </h2>
                  <Badge variant="success" size="sm">
                    <ShieldCheck className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>Verified</span>
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
              </div>
            </div>

            {/* Profile Info Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <User className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
                  <span>Full Name</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
                  <span>Email Address</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <KeyRound className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
                  <span>Auth Provider</span>
                </div>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{providerLabel}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
                  <span>Account Type</span>
                </div>
                <p className={`text-sm font-bold ${
                  user.role === 'ADMIN'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {user.role === 'ADMIN' ? 'Administrator' : 'Normal User'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
                  <span>Member Since</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{memberSince}</p>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
              <SignOutButton />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
