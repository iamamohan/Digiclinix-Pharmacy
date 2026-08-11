import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AuthPage } from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'Verify Email | Digiclinix Pharmacy',
  description: 'Verify your Digiclinix Pharmacy account email address with your 6-digit verification code.',
};

export default function VerifyEmailPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50/60 dark:bg-slate-950/40 min-h-[calc(100vh-4.5rem)] flex items-center justify-center transition-colors duration-200">
      <Container className="w-full">
        <AuthPage initialMode="VERIFY_OTP" />
      </Container>
    </div>
  );
}
