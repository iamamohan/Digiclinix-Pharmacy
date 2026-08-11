'use client';

import React, { useState, useRef } from 'react';
import { User as UserIcon, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { PasswordInput } from './PasswordInput';
import { useToast } from '@/components/providers/toast-provider';

export interface SignupFormProps {
  onSwitchToLogin?: () => void;
  onSignupSuccess?: (email: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onSignupSuccess,
}) => {
  const { error: toastError, success: toastSuccess } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);

    if (errors.name) {
      nameRef.current?.focus();
    } else if (errors.email) {
      emailRef.current?.focus();
    } else if (errors.password) {
      passwordRef.current?.focus();
    } else if (errors.confirmPassword) {
      confirmPasswordRef.current?.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const userEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: userEmail,
          password,
          confirmPassword,
        }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = resData?.error?.message || 'Failed to create account. Please try again.';
        setErrorMessage(errorMsg);
        toastError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      toastSuccess('Account created! Please check your email for your 6-digit verification code.');

      if (onSignupSuccess) {
        onSignupSuccess(userEmail);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during account creation.';
      setErrorMessage(msg);
      toastError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold font-manrope text-slate-900 dark:text-white">
          Create your account
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Join Digiclinix Pharmacy for doorstep healthcare services
        </p>
      </div>

      {/* Top Google OAuth Button */}
      <GoogleSignInButton text="Continue with Google" callbackUrl="/account" />

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
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-800/60"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Full name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              ref={nameRef}
              id="signup-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Enter your full name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'signup-name-error' : undefined}
              className={`w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                fieldErrors.name
                  ? 'border-red-400 dark:border-red-500/80 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
          </div>
          {fieldErrors.name && (
            <p id="signup-name-error" className="text-xs text-red-500 font-medium mt-1">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              ref={emailRef}
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="Enter your email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
              className={`w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                fieldErrors.email
                  ? 'border-red-400 dark:border-red-500/80 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p id="signup-email-error" className="text-xs text-red-500 font-medium mt-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          ref={passwordRef}
          id="signup-password"
          label="Password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Create a password (min 8 chars)"
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <PasswordInput
          ref={confirmPasswordRef}
          id="signup-confirm-password"
          label="Confirm password"
          required
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword)
              setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          placeholder="Confirm your password"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      {/* Switcher Footer */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
        Already have an account?{' '}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none"
          >
            Log in
          </button>
        ) : (
          <a href="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none">
            Log in
          </a>
        )}
      </div>
    </div>
  );
};
