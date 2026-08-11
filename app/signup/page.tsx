import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AuthPage } from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'Create Account | Digiclinix Pharmacy',
  description: 'Join Digiclinix Pharmacy to easily fulfill prescriptions, order healthcare items, and consult licensed pharmacists.',
};

export default function SignupPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50/60 dark:bg-slate-950/40 min-h-[calc(100vh-4.5rem)] flex items-center justify-center transition-colors duration-200">
      <Container className="w-full">
        <AuthPage initialMode="SIGNUP" />
      </Container>
    </div>
  );
}
