'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, AlertCircle, MailWarning, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { PasswordInput } from './PasswordInput';
import { useToast } from '@/components/providers/toast-provider';

export interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onUnverifiedEmail?: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onUnverifiedEmail,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);

    if (errors.email) {
      emailRef.current?.focus();
    } else if (errors.password) {
      passwordRef.current?.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setIsUnverified(false);

    const userEmail = email.trim().toLowerCase();

    try {
      const result = await signIn('credentials', {
        email: userEmail,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result) {
        throw new Error('No response from authentication server.');
      }

      if (result.error) {
        if (result.error.includes('UNVERIFIED_EMAIL')) {
          setIsUnverified(true);
          const msg = 'Please verify your email before signing in.';
          setErrorMessage(msg);
          toastError(msg);
        } else {
          const msg = 'Invalid email or password.';
          setErrorMessage(msg);
          toastError(msg);
        }
        setIsSubmitting(false);
        return;
      }

      toastSuccess('Signed in successfully! Redirecting...');
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      setErrorMessage(msg);
      toastError(msg);
      setIsSubmitting(false);
    }
  };

  const handleTriggerVerification = () => {
    if (onUnverifiedEmail) {
      onUnverifiedEmail(email.trim().toLowerCase());
    } else {
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold font-manrope text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Sign in to your Digiclinix account to continue
        </p>
      </div>

      {/* Top Google OAuth Button */}
      <GoogleSignInButton text="Continue with Google" callbackUrl={callbackUrl} />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-5">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-white dark:bg-[#111827]">
          or
        </span>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={`p-4 rounded-xl text-xs border space-y-2.5 ${
            isUnverified
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/60'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isUnverified ? (
              <MailWarning className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span className="font-medium">{errorMessage}</span>
          </div>

          {isUnverified && (
            <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between gap-2">
              <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400">
                Have a 6-digit verification code?
              </span>
              <button
                type="button"
                onClick={handleTriggerVerification}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none inline-flex items-center gap-1 shrink-0"
              >
                <span>Enter Code</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              ref={emailRef}
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="Enter your email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
              className={`w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                fieldErrors.email
                  ? 'border-red-400 dark:border-red-500/80 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p id="login-email-error" className="text-xs text-red-500 font-medium mt-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          ref={passwordRef}
          id="login-password"
          label="Password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Enter your password"
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full font-bold bg-purple-600 hover:bg-purple-700 text-white mt-2 shadow-md shadow-purple-500/20"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      {/* Switcher Footer */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
        Don&apos;t have an account?{' '}
        {onSwitchToSignup ? (
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none"
          >
            Create account
          </button>
        ) : (
          <a href="/signup" className="font-bold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none">
            Create account
          </a>
        )}
      </div>
    </div>
  );
};
