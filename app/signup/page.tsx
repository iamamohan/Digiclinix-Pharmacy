import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | Digiclinix Pharmacy',
  description: 'Join Digiclinix Pharmacy to easily fulfill prescriptions, order healthcare items, and consult licensed pharmacists.',
};

export default function SignupPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50/60 dark:bg-slate-950/40 min-h-[calc(100vh-4.5rem)] flex items-center">
      <Container className="w-full">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-slate-900 dark:text-white">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sign up today for certified medical care and doorstep pharmacy delivery.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            <SignupForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
