'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';

export interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onChangeEmail: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onSuccess,
  onChangeEmail,
}) => {
  const toast = useToast();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Client-side visual resend cooldown timer (60s)
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start 60s cooldown on mount (since signup/resend just triggered an OTP)
  useEffect(() => {
    setCooldown(60);
  }, []);

  // Countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus first input box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '');
    if (!digit) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const singleDigit = digit.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    // Auto advance focus
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const focusIdx = Math.min(pastedData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const fullOtp = otp.join('');
  const isOtpComplete = fullOtp.length === 6 && /^\d{6}$/.test(fullOtp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isOtpComplete || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast.success('Email verified successfully!');
        onSuccess();
      } else {
        const errorMsg = data?.error?.message || 'Invalid or expired verification code.';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = 'An unexpected error occurred during verification.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendNotice(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setCooldown(60);
        setResendNotice('A new verification code has been sent.');
        toast.success('A new verification code has been sent.');
      } else {
        const msg = data?.error?.message || 'Failed to resend verification code.';
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch {
      toast.error('Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 mb-1">
          <KeyRound className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-extrabold font-manrope text-slate-900 dark:text-white">
          Verify your email
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          We sent a 6-digit verification code to
        </p>
        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 truncate">
          {email || 'your email address'}
        </p>
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

      {/* Resend Success Notice */}
      {resendNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/60 text-center">
          ✓ {resendNotice}
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${idx + 1} of verification code`}
                className="w-11 h-12 sm:w-12 sm:h-14 text-center font-extrabold text-lg sm:text-xl rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-purple-700 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-xs"
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2.5">
            ⏱️ Code expires in 10 minutes. Maximum 5 attempts allowed.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={!isOtpComplete || isSubmitting}
          className="w-full font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
        >
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </Button>
      </form>

      {/* Resend & Change Email Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-3">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Didn&apos;t receive the code?{' '}
          {cooldown > 0 ? (
            <span className="font-bold text-slate-400">
              Resend available in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend code</span>
            </button>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Change email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
