'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, Award, Lock, BadgeCheck, CheckCircle2 } from 'lucide-react';

const COMMITMENTS = [
  { id: 'genuine', icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />, title: 'Genuine Medicines Guarantee', text: 'Sourced strictly from certified pharmaceutical distributors.' },
  { id: 'licensed', icon: <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />, title: 'Licensed Pharmacy Oversight', text: 'All operations supervised by experienced clinical pharmacists.' },
  { id: 'security', icon: <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />, title: 'Secure Patient Data', text: 'Encrypted order processing protecting patient prescription privacy.' },
  { id: 'quality', icon: <BadgeCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />, title: 'Quality Inspection', text: 'Strict batch and expiration date checks prior to dispatch.' },
];

export const HealthcareCommitments: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpProps = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      ease: 'easeOut' as const,
    },
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200" aria-label="Healthcare Commitments">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Our Quality Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Why Patients Trust Digiclinix
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Our strict healthcare commitments ensure clinical safety and peace of mind with every order.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {COMMITMENTS.map((item) => (
            <motion.div
              key={item.id}
              {...fadeUpProps}
              className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-inter">
                  {item.text}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Verified Standard</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
