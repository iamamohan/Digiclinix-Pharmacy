'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Upload, Phone, FileText, CheckCircle2, File, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrustPoint {
  id: string;
  label: string;
}

// ─── Constants (Memoized outside render cycle) ───────────────────────────────

const TRUST_POINTS: TrustPoint[] = [
  { id: 'secure', label: 'Secure Prescription Handling' },
  { id: 'licensed', label: 'Licensed Pharmacists' },
  { id: 'fast', label: 'Fast Delivery' },
];

/** Pre-filled WhatsApp message for better UX */
const WHATSAPP_URL =
  'https://wa.me/919182015238?text=Hello%20Digiclinix%2C%20I%20would%20like%20to%20order%20medicines%20using%20my%20prescription.%20Please%20assist%20me.';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFadeUp(delay: number, shouldReduceMotion: boolean | null) {
  return {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      delay: shouldReduceMotion ? 0 : delay,
      ease: 'easeOut' as const,
    },
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PrescriptionBanner: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  /** Selected prescription filename for preview — no upload performed */
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  /**
   * Ref to hidden file input for prescription selection.
   *
   * // TODO:
   * // Connect this button to the prescription upload API
   * // in a future backend phase.
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleClearFile = () => {
    setSelectedFileName(null);
  };

  return (
    <section
      aria-labelledby="prescription-heading"
      aria-describedby="prescription-description"
      className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-200"
    >
      <Container>
        {/* ─── Premium Card ─── */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ──────────── LEFT: Content ──────────── */}
            <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">

              {/* Badge */}
              <motion.div {...useFadeUp(0, shouldReduceMotion)}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Prescription Orders
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                id="prescription-heading"
                {...useFadeUp(0.1, shouldReduceMotion)}
                className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight leading-tight"
              >
                Upload Your{' '}
                <span className="text-blue-600 dark:text-blue-400">Prescription</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                id="prescription-description"
                {...useFadeUp(0.2, shouldReduceMotion)}
                className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed"
              >
                Simply upload your doctor&apos;s prescription and our pharmacists will verify it before preparing your order.
              </motion.p>

              {/* File Name Preview */}
              {selectedFileName && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50"
                  role="status"
                  aria-live="polite"
                >
                  <File className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate flex-1">
                    {selectedFileName}
                  </span>
                  <button
                    onClick={handleClearFile}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-0.5 shrink-0"
                    aria-label="Remove selected prescription file"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div
                {...useFadeUp(0.3, shouldReduceMotion)}
                className={cn('flex flex-col sm:flex-row gap-3', selectedFileName ? 'mt-5' : 'mt-7')}
              >
                {/* Hidden file input */}
                {/* TODO: Connect this button to the prescription upload API in a future backend phase. */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  aria-hidden="true"
                  tabIndex={-1}
                  onChange={handleFileChange}
                />

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Upload className="w-4 h-4" aria-hidden="true" />}
                    onClick={handleUploadClick}
                    className="w-full sm:w-auto"
                    aria-label="Upload Your Prescription — select your prescription file"
                  >
                    {selectedFileName ? 'Change File' : 'Upload Your Prescription'}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    href={WHATSAPP_URL}
                    variant="outline"
                    size="lg"
                    leftIcon={<Phone className="w-4 h-4" aria-hidden="true" />}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                    aria-label="Order via WhatsApp with pre-filled prescription message — opens in a new tab"
                  >
                    WhatsApp Order
                  </Button>
                </motion.div>
              </motion.div>

              {/* Accepted formats note */}
              <motion.p
                {...useFadeUp(0.35, shouldReduceMotion)}
                className="mt-3 text-xs text-slate-400 dark:text-slate-500"
              >
                Accepted: PDF, JPG, PNG, WebP &mdash; Max 10MB
              </motion.p>

              {/* Trust Indicators */}
              <motion.ul
                {...useFadeUp(0.4, shouldReduceMotion)}
                className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-2 list-none"
                aria-label="Trust indicators"
              >
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point.id}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>{point.label}</span>
                  </li>
                ))}
              </motion.ul>

            </div>

            {/* ──────────── RIGHT: Illustration ──────────── */}
            <motion.div
              {...useFadeUp(0.4, shouldReduceMotion)}
              className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-slate-900 min-h-[360px]"
              aria-hidden="true"
            >
              {/* Decorative soft blob */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-200/40 dark:bg-blue-800/20 blur-3xl" />
              </div>

              <div className="relative z-10 w-72 h-72 xl:w-80 xl:h-80">
                <Image
                  src="/images/prescription/prescription-banner.webp"
                  alt="Prescription illustration showing a doctor's prescription with pharmacy items"
                  fill
                  sizes="(max-width: 1280px) 288px, 320px"
                  className="object-contain drop-shadow-xl"
                  priority={false}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </Container>
    </section>
  );
};
