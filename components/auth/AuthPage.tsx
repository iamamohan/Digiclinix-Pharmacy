'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { OTPVerification } from './OTPVerification';

export type AuthMode = 'LOGIN' | 'SIGNUP' | 'VERIFY_OTP' | 'SUCCESS';

export interface AuthPageProps {
  initialMode?: AuthMode;
}

function AuthPageContent({ initialMode = 'LOGIN' }: AuthPageProps) {
  const searchParams = useSearchParams();
  
  // Read optional URL parameters for backward compatibility
  const queryMode = searchParams.get('mode');
  const queryEmail = searchParams.get('email');

  const getStartingMode = (): AuthMode => {
    if (queryMode === 'signup') return 'SIGNUP';
    if (queryMode === 'verify' || queryMode === 'verify-otp') return 'VERIFY_OTP';
    return initialMode;
  };

  const [mode, setMode] = useState<AuthMode>(getStartingMode);
  const [verificationEmail, setVerificationEmail] = useState<string>(queryEmail || '');

  // Keep verification email synced if query param changes
  useEffect(() => {
    if (queryEmail && !verificationEmail) {
      setVerificationEmail(queryEmail);
    }
  }, [queryEmail, verificationEmail]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Unified Adaptive Card Container (Supports Light & Dark themes) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-6 text-slate-900 dark:text-white transition-colors duration-200">
        
        {/* Brand Header Logo */}
        <div className="text-center pb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group focus:outline-none"
            aria-label="Digiclinix Pharmacy Home"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold font-manrope tracking-tight text-slate-900 dark:text-white">
              DIGICLINIX
            </span>
          </Link>
        </div>

        {/* Dynamic Auth State Rendering */}
        {mode === 'LOGIN' && (
          <LoginForm
            onSwitchToSignup={() => setMode('SIGNUP')}
            onUnverifiedEmail={(email) => {
              setVerificationEmail(email);
              setMode('VERIFY_OTP');
            }}
          />
        )}

        {mode === 'SIGNUP' && (
          <SignupForm
            onSwitchToLogin={() => setMode('LOGIN')}
            onSignupSuccess={(email) => {
              setVerificationEmail(email);
              setMode('VERIFY_OTP');
            }}
          />
        )}

        {mode === 'VERIFY_OTP' && (
          <OTPVerification
            email={verificationEmail}
            onSuccess={() => setMode('SUCCESS')}
            onChangeEmail={() => setMode('SIGNUP')}
          />
        )}

        {mode === 'SUCCESS' && (
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-manrope text-slate-900 dark:text-white">
                Email verified
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your email has been verified successfully. Please log in with your account credentials.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setMode('LOGIN')}
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                className="w-full font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
              >
                Continue to Login
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export function AuthPage(props: AuthPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          Loading authentication...
        </div>
      }
    >
      <AuthPageContent {...props} />
    </Suspense>
  );
}
