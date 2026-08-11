'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export type AuthMode = 'LOGIN' | 'SIGNUP';

export interface AuthPageProps {
  initialMode?: AuthMode;
}

function AuthPageContent({ initialMode = 'LOGIN' }: AuthPageProps) {
  const searchParams = useSearchParams();
  const queryMode = searchParams.get('mode');

  const getStartingMode = (): AuthMode => {
    if (queryMode === 'signup') return 'SIGNUP';
    return initialMode;
  };

  const [mode, setMode] = useState<AuthMode>(getStartingMode);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Unified Adaptive Card Container */}
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

        {/* Dynamic Auth State Rendering (LOGIN vs SIGNUP) */}
        {mode === 'LOGIN' ? (
          <LoginForm onSwitchToSignup={() => setMode('SIGNUP')} />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setMode('LOGIN')}
            onSignupSuccess={() => setMode('LOGIN')}
          />
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
