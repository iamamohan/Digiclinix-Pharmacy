import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui/Container';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Digiclinix Pharmacy',
  description: 'Sign in to your Digiclinix Pharmacy account to manage prescriptions, orders, and healthcare services.',
};

export default function LoginPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50/60 dark:bg-slate-950/40 min-h-[calc(100vh-4.5rem)] flex items-center">
      <Container className="w-full">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sign in to manage your medical orders and healthcare preferences.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs text-slate-400">Loading form...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
